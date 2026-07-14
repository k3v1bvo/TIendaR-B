# ⚡ Upcycling Lab — E-Commerce Cyber-Sustainable & Portal Contable

![Upcycling Lab Banner](https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=1200&q=80)

**Upcycling Lab** es una plataforma de comercio electrónico de vanguardia y sistema contable administrativo diseñada para marcas de moda sostenible, upcycling urbano y accesorios creados a partir de materiales reconfigurados (como cámaras de caucho reciclado de neumáticos y prendas vintage recuperadas).

La plataforma combina un **Laboratorio de Personalización (Custom Lab)** interactivo, un **Catálogo con Control de Lotes**, un **Checkout con Pago QR & Subida de Comprobantes** y un **Dashboard Contable/Admin** de nivel empresarial con seguridad RLS y actualización de inventario atómica.

---

## 🛠️ Stack Tecnológico & Arquitectura

| Categoría | Tecnología | Uso y Justificación en el Proyecto |
| :--- | :--- | :--- |
| **Framework Core** | **Next.js 15 (App Router)** | Renderizado híbrido (SSR + Client Components), enrutamiento de páginas y rutas API sin servidor (`/api/admin/...`). |
| **Lenguaje** | **TypeScript 5** | Tipado estático robusto en interfaces de usuario, esquemas de base de datos y flujos financieros. |
| **Librería UI** | **React 19** | Gestión de estado reactivo, modales en tiempo real, carritos dinámicos y micro-animaciones. |
| **Base de Datos & Auth** | **Supabase (PostgreSQL)** | Base de datos relacional con **Row-Level Security (RLS)**, funciones atómicas (`plpgsql`), extensiones `uuid-ossp` y autenticación segura. |
| **Estilizado & Diseño** | **Tailwind CSS 3.4** | Diseño estético *Cyber-Upcycling* con paletas *Dark Obsidian*, *Glassmorphism*, acentos de neón (`#FFB800`, verde, púrpura) y bordes translúcidos. |
| **Iconografía & Visual** | **Lucide React** | Iconografía SVG moderna, escalable y optimizada con iluminación neón. |
| **Validación & Notificaciones** | **Zod & Nodemailer** | Validación estricta de payloads de pedidos y despacho de correos electrónicos transaccionales/auditoría. |

---

## 🚀 Módulos & Características Principales

### 1. 🎨 Laboratorio de Customización (`/laboratorio`)
* **Cotizador Dinámico en Vivo:** Permite al cliente seleccionar prendas base (chamarras denim acid wash, chalecos grunge, pantalones cargo) e inyectar modificadores artísticos (bordados dorsales, pintura neón UV, parches psicodélicos, herrajes industriales).
* **Cálculo de Modificadores:** Suma en tiempo real el precio de la prenda con el costo extra individual de cada intervención seleccionada.

### 2. 🏴 Catálogo de Billeteras de Caucho (`/billeteras`)
* **Colecciones por Lote de Producción:** Identificación de piezas seriadas (ej. `LOTE-01-2026`) confeccionadas con cámaras de caucho recuperadas.
* **Control de Existencias:** Validación inmediata en el drawer del carrito (`CartDrawer`) contra la disponibilidad física (`stock_disponible`).

### 3. 💸 Checkout por Código QR & Comprobantes (`QRCheckoutModal`)
* **Pago Interbancario Instantáneo:** Despliegue del código QR bancario para transferencia o billetera móvil.
* **Subida de Capturas de Pago:** El usuario adjunta su comprobante o fotografía bancaria junto con sus datos de envío, generando una orden con token seguro y estado inicial `⏳ Comprobante Pendiente`.

### 4. 🔐 Portal Contable & Dashboard Admin (`/admin`)
* **Auditoría 1-Clic con Zoom:** Panel especializado donde el administrador inspecciona el comprobante bancario del cliente en una ventana emergente de alta definición (`Eye`). Con el botón de **Verificar Pago**, el sistema ejecuta una transacción de base de datos que aprueba el pago, cambia el estado de la orden y **disminuye atómicamente el stock** de las prendas y billeteras.
* **Gestión de Lotes & Stock en Vivo:** Pestaña de inventario donde el administrador puede ajustar sumando o restando (+/- delta) existencias físicas de manera directa a la base de datos en Supabase.
* **Modo Demo & Supabase Auth:** Soporte para inicio de sesión en producción con JWT de Supabase o acceso rápido para pruebas locales (`admin@upcyclinglab.com` / `admin123`).

---

## 💻 Guía de Puesta en Marcha & Instalación

Sigue estos pasos para ejecutar la plataforma en tu entorno de desarrollo local:

### 📋 Requisitos Previos
* **Node.js** v18.17 o superior.
* **npm** (o pnpm / yarn).
* Una cuenta y proyecto activo en [Supabase](https://supabase.com).

### 1️⃣ Clonar o Descargar el Proyecto
Abre tu terminal dentro de la carpeta del proyecto (`d:\ProyectosCode\TiendaDIseñoPersonalizacion`):

```powershell
# Verificar ubicación actual
pwd
```

### 2️⃣ Instalar Dependencias
Instala los paquetes de Next.js, React, Supabase y librerías auxiliares:

```powershell
npm install
```

### 3️⃣ Configurar Variables de Entorno (`.env.local`)
Copia el archivo `.env.example` y renómbralo como `.env.local`. Luego rellena las credenciales obtenidas desde el panel de **Supabase -> Settings -> API**:

```env
# URL de tu Proyecto Supabase
NEXT_PUBLIC_SUPABASE_URL="https://tu-proyecto.supabase.co"

# Clave pública anónima (Anon Key)
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsIn..."

# Clave de servicio de administrador (Service Role Key - ¡No compartir!)
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsIn..."

# Opcional: Credenciales SMTP para envío de correos de confirmación
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="465"
SMTP_USER="tu-correo@gmail.com"
SMTP_PASS="tu-contraseña-o-token-de-app"
```

### 4️⃣ Configurar la Base de Datos en Supabase
1. Ve a tu proyecto en **Supabase Dashboard** -> **SQL Editor**.
2. Abre en tu editor el archivo [supabase/migrations/20260714_antigravity_core_schema.sql](file:///d:/ProyectosCode/TiendaDIse%C3%B1oPersonalizacion/supabase/migrations/20260714_antigravity_core_schema.sql).
3. Copia todo su contenido, pégalo en el editor SQL de Supabase y presiona **Run**.
4. *(Esto creará las tablas de usuarios, productos, modificadores, billeteras, pedidos, pagos QR, las políticas RLS y los datos semilla de demostración)*.

### 5️⃣ Arrancar el Servidor de Desarrollo
Inicia la aplicación de Next.js localmente:

```powershell
npm run dev
```

La tienda estará en vivo y accesible desde tu navegador en:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🗺️ Estructura del Proyecto

```text
├── src/
│   ├── app/
│   │   ├── admin/             # Portal Contable, Auditoría QR y Gestión de Inventario
│   │   ├── api/               # Rutas API Backend (Verificación QR, Ajuste de Stock, Checkout)
│   │   ├── billeteras/        # Catálogo upcycled de caucho y control por lotes
│   │   ├── laboratorio/       # Laboratorio visual de personalización de ropa
│   │   ├── layout.tsx         # Layout principal e importación de fuentes globales
│   │   └── page.tsx           # Página de inicio / Tienda pública
│   ├── components/
│   │   ├── checkout/          # Modal de Checkout QR, carga de imagen y confirmación
│   │   ├── shop/              # Catálogos, Drawer de Carrito, Tarjetas de producto
│   │   └── ui/                # Navbar, Footer, Botones de neón y contenedores Glass
│   └── lib/
│       └── supabase/          # Clientes de Supabase (browser client y admin client SSR)
├── supabase/
│   └── migrations/            # Scripts SQL, esquemas relacionales, políticas RLS y triggers
├── ARQUITECTURA_Y_FLUJOS.md   # Documentación técnica extendida de flujos y relaciones
├── package.json               # Dependencias del proyecto
└── README.md                  # Documentación oficial
```

---

## 🛡️ Seguridad & Auditoría
* **RLS (Row Level Security):** Todas las tablas impiden el borrado o alteración pública no autorizada. La inserción de pedidos está abierta al público en el checkout, pero la revisión financiera y el ajuste de inventario exigen verificación de rol `'admin'`.
* **Transacciones Atómicamente Seguras:** La función `verificar_pago_y_restar_stock()` previene condiciones de carrera al descontar unidades físicas (`FOR UPDATE`) en el mismo bloque donde se audita el comprobante bancario.

---
*Desarrollado con estándares de código limpio y diseño estético de alta gama — Upcycling Lab 2026.*
