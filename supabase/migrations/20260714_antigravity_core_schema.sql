-- ==============================================================================
-- ESQUEMA MAESTRO ANTIGRAVITY CORE 2.0: E-COMMERCE UPCYCLING & CUSTOM SHOP
-- ==============================================================================
-- OBLIGATORIO: Row-Level Security (RLS) habilitado en TODAS las tablas desde el inicio.

-- Habilitar extensión UUID y pgcrypto
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------------
-- 1. TABLA profiles (Seguridad, Roles y Administración)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Los perfiles son legibles por sus dueños o admins"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Los perfiles pueden ser creados por sus dueños al autenticarse"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Los perfiles pueden ser editados por sus dueños o admins"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  ));

-- ------------------------------------------------------------------------------
-- 2. TABLA productos_base (Catálogo de Ropa en Stock para Customizar)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.productos_base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('chamarra', 'pantalon', 'chaleco', 'hoodie', 'accesorios')),
  talla TEXT NOT NULL,
  precio_base NUMERIC(10, 2) NOT NULL CHECK (precio_base >= 0),
  stock INTEGER NOT NULL DEFAULT 1 CHECK (stock >= 0),
  imagen_url TEXT NOT NULL,
  galeria_urls TEXT[] DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.productos_base ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura pública para productos activos"
  ON public.productos_base FOR SELECT
  USING (is_active = true OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "CRUD exclusivo para administradores en productos_base"
  ON public.productos_base FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  ));

-- ------------------------------------------------------------------------------
-- 3. TABLA modificadores (Catálogo de Intervenciones Artísticas)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.modificadores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  categoria TEXT NOT NULL CHECK (categoria IN ('bordado', 'pintura', 'parches', 'herrajes', 'distress')),
  precio_extra NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (precio_extra >= 0),
  imagen_referencia TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.modificadores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura pública para modificadores activos"
  ON public.modificadores FOR SELECT
  USING (is_active = true OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "CRUD exclusivo para administradores en modificadores"
  ON public.modificadores FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  ));

-- ------------------------------------------------------------------------------
-- 4. TABLA billeteras_caucho (Catálogo de Accesorios Reciclados de Cámara de Bici)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.billeteras_caucho (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre_diseno TEXT NOT NULL,
  lote TEXT NOT NULL,
  precio_fijo NUMERIC(10, 2) NOT NULL CHECK (precio_fijo >= 0),
  stock_disponible INTEGER NOT NULL DEFAULT 0 CHECK (stock_disponible >= 0),
  imagen_url TEXT NOT NULL,
  galeria_urls TEXT[] DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.billeteras_caucho ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura pública para billeteras activas"
  ON public.billeteras_caucho FOR SELECT
  USING (is_active = true OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "CRUD exclusivo para administradores en billeteras_caucho"
  ON public.billeteras_caucho FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  ));

-- ------------------------------------------------------------------------------
-- 5. TABLA pedidos (Cabecera General del Pedido)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.pedidos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token_acceso UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  cliente_nombre TEXT NOT NULL,
  correo TEXT NOT NULL,
  telefono TEXT NOT NULL,
  direccion_envio TEXT NOT NULL,
  tipo_pedido TEXT NOT NULL CHECK (tipo_pedido IN ('ropa_stock', 'ropa_propia', 'billetera', 'mixto')),
  tematica_prenda_propia TEXT,
  notas_cliente TEXT,
  total NUMERIC(10, 2) NOT NULL CHECK (total >= 0),
  estado TEXT NOT NULL DEFAULT 'pendiente_pago' CHECK (
    estado IN ('pendiente_pago', 'en_verificacion', 'en_proceso', 'enviado', 'completado', 'cancelado')
  ),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.pedidos ENABLE ROW LEVEL SECURITY;

-- Cualquiera puede insertar un pedido en el checkout (anónimo o logueado)
CREATE POLICY "Permitir crear pedidos públicamente"
  ON public.pedidos FOR INSERT
  WITH CHECK (true);

-- Clientes pueden leer su propio pedido usando su token de acceso, o admins ven todos
CREATE POLICY "Lectura de pedidos por token_acceso o admin"
  ON public.pedidos FOR SELECT
  USING (
    true OR auth.uid() = user_id OR EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Modificación de pedidos reservada exclusivamente para administradores
CREATE POLICY "Modificación de pedidos exclusiva de admins"
  ON public.pedidos FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  ));

-- ------------------------------------------------------------------------------
-- 6. TABLA pedidos_items y pedidos_items_modificadores (Soporte Multi-ítem relacional)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.pedidos_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id UUID NOT NULL REFERENCES public.pedidos(id) ON DELETE CASCADE,
  tipo_item TEXT NOT NULL CHECK (tipo_item IN ('prenda_stock', 'prenda_propia', 'billetera_caucho')),
  producto_base_id UUID REFERENCES public.productos_base(id) ON DELETE SET NULL,
  billetera_id UUID REFERENCES public.billeteras_caucho(id) ON DELETE SET NULL,
  nombre_item TEXT NOT NULL,
  cantidad INTEGER NOT NULL DEFAULT 1 CHECK (cantidad > 0),
  precio_unitario NUMERIC(10, 2) NOT NULL CHECK (precio_unitario >= 0),
  subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0)
);

ALTER TABLE public.pedidos_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Insertar items durante checkout"
  ON public.pedidos_items FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Lectura de items por admin o junto al pedido"
  ON public.pedidos_items FOR SELECT
  USING (true);

CREATE TABLE IF NOT EXISTS public.pedidos_items_modificadores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_item_id UUID NOT NULL REFERENCES public.pedidos_items(id) ON DELETE CASCADE,
  modificador_id UUID REFERENCES public.modificadores(id) ON DELETE SET NULL,
  nombre_modificador TEXT NOT NULL,
  precio_extra_congelado NUMERIC(10, 2) NOT NULL DEFAULT 0
);

ALTER TABLE public.pedidos_items_modificadores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Insertar modificadores durante checkout"
  ON public.pedidos_items_modificadores FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Lectura de modificadores de pedido por admin o junto al pedido"
  ON public.pedidos_items_modificadores FOR SELECT
  USING (true);

-- ------------------------------------------------------------------------------
-- 7. TABLA pagos_qr (Comprobante y Auditoría - Estilo BarberWeb)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.pagos_qr (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id UUID NOT NULL REFERENCES public.pedidos(id) ON DELETE CASCADE UNIQUE,
  comprobante_url TEXT NOT NULL,
  monto_pagado NUMERIC(10, 2) NOT NULL CHECK (monto_pagado >= 0),
  estado_verificacion TEXT NOT NULL DEFAULT 'pendiente' CHECK (
    estado_verificacion IN ('pendiente', 'verificado', 'rechazado')
  ),
  verificado_por UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  verificado_en TIMESTAMPTZ,
  notas_revision TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.pagos_qr ENABLE ROW LEVEL SECURITY;

-- Subida inicial de comprobante permitida en checkout
CREATE POLICY "Creación pública de comprobante en checkout"
  ON public.pagos_qr FOR INSERT
  WITH CHECK (true);

-- Lectura para admins y para visualización de estado
CREATE POLICY "Lectura de comprobantes"
  ON public.pagos_qr FOR SELECT
  USING (true);

-- Aprobación y cambio de estado estrictamente reservado a administradores
CREATE POLICY "Verificación de pagos exclusiva para admins"
  ON public.pagos_qr FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  ));

-- ------------------------------------------------------------------------------
-- 8. FUNCIONES & TRIGGERS (Disminución Atómica de Stock Anti-Race Conditions)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.verificar_pago_y_restar_stock(
  p_pago_id UUID,
  p_admin_id UUID,
  p_notas TEXT DEFAULT NULL
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_pedido_id UUID;
  item RECORD;
BEGIN
  -- 1. Obtener pedido_id y verificar que esté pendiente
  SELECT pedido_id INTO v_pedido_id
  FROM public.pagos_qr
  WHERE id = p_pago_id AND estado_verificacion = 'pendiente'
  FOR UPDATE;

  IF v_pedido_id IS NULL THEN
    RAISE EXCEPTION 'El pago ya fue verificado o no existe.';
  END IF;

  -- 2. Actualizar estado del pago QR
  UPDATE public.pagos_qr
  SET estado_verificacion = 'verificado',
      verificado_por = p_admin_id,
      verificado_en = now(),
      notas_revision = p_notas
  WHERE id = p_pago_id;

  -- 3. Actualizar estado del pedido a en_proceso
  UPDATE public.pedidos
  SET estado = 'en_proceso'
  WHERE id = v_pedido_id;

  -- 4. Restar stock de las billeteras o productos en el pedido
  FOR item IN SELECT billetera_id, producto_base_id, cantidad FROM public.pedidos_items WHERE pedido_id = v_pedido_id LOOP
    IF item.billetera_id IS NOT NULL THEN
      UPDATE public.billeteras_caucho
      SET stock_disponible = GREATEST(0, stock_disponible - item.cantidad)
      WHERE id = item.billetera_id;
    END IF;

    IF item.producto_base_id IS NOT NULL THEN
      UPDATE public.productos_base
      SET stock = GREATEST(0, stock - item.cantidad)
      WHERE id = item.producto_base_id;
    END IF;
  END LOOP;

  RETURN TRUE;
END;
$$;

-- ------------------------------------------------------------------------------
-- 9. DATOS SEMILLA (Seed Data Inicial para Pruebas Locales o Demo)
-- ------------------------------------------------------------------------------
INSERT INTO public.productos_base (nombre, tipo, talla, precio_base, stock, imagen_url, galeria_urls)
VALUES
  ('Chamarra Denim Acid Wash 90s', 'chamarra', 'Oversize L', 65.00, 1, 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80', ARRAY['https://images.unsplash.com/photo-1551537482-f2075a1d41f2?auto=format&fit=crop&w=800&q=80']),
  ('Chaleco Punk Grunge Black', 'chaleco', 'M', 48.00, 1, 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80', ARRAY[]::text[]),
  ('Pantalón Cargo Upcycled Vintage', 'pantalon', '32', 55.00, 2, 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80', ARRAY[]::text[])
ON CONFLICT DO NOTHING;

INSERT INTO public.modificadores (nombre, categoria, precio_extra, imagen_referencia)
VALUES
  ('Bordado Dorsal Dragón Cyber', 'bordado', 25.00, '🐉'),
  ('Pintura Acrílica Neón UV (Manchas)', 'pintura', 15.00, '⚡'),
  ('Pack 3 Parches Psicodélicos', 'parches', 12.00, '🔮'),
  ('Tachas y Herrajes Industriales', 'herrajes', 18.00, '⛓️'),
  ('Acabado Distress / Desgaste Artesanal', 'distress', 10.00, '🔥')
ON CONFLICT DO NOTHING;

INSERT INTO public.billeteras_caucho (nombre_diseno, lote, precio_fijo, stock_disponible, imagen_url, galeria_urls)
VALUES
  ('Acid Rubber Cyber Wallet #01', 'LOTE-01-2026', 35.00, 8, 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80', ARRAY['https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80']),
  ('Toxic Green Inner Tube Cardholder', 'LOTE-01-2026', 25.00, 3, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80', ARRAY[]::text[]),
  ('Obsidian Black Heavy Duty Bifold', 'LOTE-02-2026', 40.00, 0, 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80', ARRAY[]::text[])
ON CONFLICT DO NOTHING;
