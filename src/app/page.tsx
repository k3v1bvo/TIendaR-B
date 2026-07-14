'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/ui/Navbar'
import { Footer } from '@/components/ui/Footer'
import { CustomLabConfigurator, PrendaBaseItem, ModificadorItem } from '@/components/shop/CustomLabConfigurator'
import { AcidRubberCatalog, BilleteraItem } from '@/components/shop/AcidRubberCatalog'
import { CartDrawer, CartItem } from '@/components/shop/CartDrawer'
import { QRCheckoutModal } from '@/components/checkout/QRCheckoutModal'
import { Sparkles, ShieldCheck, ArrowRight, Zap, Recycle, Shield, Heart, Eye, Star, CheckCircle2 } from 'lucide-react'

// Mock de seed para que la app sea inmediatamente interactiva al abrir en localhost
const MOCK_PRENDAS_STOCK: PrendaBaseItem[] = [
  {
    id: 'p1',
    nombre: 'Chamarra Denim Acid Wash 90s',
    tipo: 'chamarra',
    talla: 'Oversize L',
    precio_base: 65.0,
    stock: 1,
    imagen_url: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p2',
    nombre: 'Chaleco Punk Grunge Black',
    tipo: 'chaleco',
    talla: 'M',
    precio_base: 48.0,
    stock: 1,
    imagen_url: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'p3',
    nombre: 'Pantalón Cargo Upcycled Vintage',
    tipo: 'pantalon',
    talla: '32',
    precio_base: 55.0,
    stock: 2,
    imagen_url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80',
  },
]

const MOCK_MODIFICADORES: ModificadorItem[] = [
  { id: 'm1', nombre: 'Bordado Dorsal Dragón Cyber', categoria: 'bordado', precio_extra: 25.0, imagen_referencia: '🐉' },
  { id: 'm2', nombre: 'Pintura Acrílica Neón UV (Manchas)', categoria: 'pintura', precio_extra: 15.0, imagen_referencia: '⚡' },
  { id: 'm3', nombre: 'Pack 3 Parches Psicodélicos', categoria: 'parches', precio_extra: 12.0, imagen_referencia: '🔮' },
  { id: 'm4', nombre: 'Tachas y Herrajes Industriales', categoria: 'herrajes', precio_extra: 18.0, imagen_referencia: '⛓️' },
  { id: 'm5', nombre: 'Acabado Distress / Desgaste Artesanal', categoria: 'distress', precio_extra: 10.0, imagen_referencia: '🔥' },
]

const MOCK_BILLETERAS: BilleteraItem[] = [
  {
    id: 'b1',
    nombre_diseno: 'Acid Rubber Cyber Wallet #01',
    lote: 'LOTE-01-2026',
    precio_fijo: 35.0,
    stock_disponible: 8,
    imagen_url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'b2',
    nombre_diseno: 'Toxic Green Inner Tube Cardholder',
    lote: 'LOTE-01-2026',
    precio_fijo: 3,
    stock_disponible: 3,
    imagen_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'b3',
    nombre_diseno: 'Obsidian Black Heavy Duty Bifold',
    lote: 'LOTE-02-2026',
    precio_fijo: 40.0,
    stock_disponible: 0,
    imagen_url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
  },
]

export default function HomePage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'all' | 'lab' | 'rubber'>('all')

  // Estado global simple del carrito y modales
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

  // Agregar ítem custom del laboratorio
  const handleAddCustomItem = (itemData: {
    tipo_item: 'prenda_stock' | 'prenda_propia'
    producto_base?: PrendaBaseItem
    nombre_item: string
    precio_unitario: number
    modificadores_seleccionados: ModificadorItem[]
    tematica_prenda_propia?: string
  }) => {
    const newItem: CartItem = {
      id: `cart-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      tipo_item: itemData.tipo_item,
      nombre_item: itemData.nombre_item,
      precio_unitario: itemData.precio_unitario,
      cantidad: 1,
      producto_base_id: itemData.producto_base?.id,
      imagen_url: itemData.producto_base?.imagen_url || 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?auto=format&fit=crop&w=600&q=80',
      modificadores_seleccionados: itemData.modificadores_seleccionados,
      tematica_prenda_propia: itemData.tematica_prenda_propia,
    }

    setCart((prev) => [...prev, newItem])
    setIsCartOpen(true)
  }

  // Agregar billetera de caucho
  const handleAddBilletera = (billetera: BilleteraItem) => {
    const existingIndex = cart.findIndex((i) => i.billetera_id === billetera.id)
    if (existingIndex > -1) {
      const updated = [...cart]
      if (updated[existingIndex].cantidad < billetera.stock_disponible) {
        updated[existingIndex].cantidad += 1
      }
      setCart(updated)
    } else {
      setCart((prev) => [
        ...prev,
        {
          id: `cart-${Date.now()}-${billetera.id}`,
          tipo_item: 'billetera_caucho',
          billetera_id: billetera.id,
          nombre_item: billetera.nombre_diseno,
          precio_unitario: billetera.precio_fijo,
          cantidad: 1,
          imagen_url: billetera.imagen_url,
        },
      ])
    }
    setIsCartOpen(true)
  }

  const handleRemoveFromCart = (id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id))
  }

  const handleOrderSuccess = (tokenAcceso: string) => {
    setIsCheckoutOpen(false)
    setCart([])
    router.push(`/pedido/${tokenAcceso}`)
  }

  return (
    <div className="min-h-screen flex flex-col justify-between transition-colors duration-300">
      <Navbar cartCount={cart.reduce((a, b) => a + b.cantidad, 0)} onOpenCart={() => setIsCartOpen(true)} />

      <main className="flex-1 space-y-20 md:space-y-32">
        {/* =========================================================================
            HERO SECTION: FASHION eCOMMERCE EDITORIAL LANDING (ESTILO DRIBBBLE & BONITA)
            ========================================================================= */}
        <section className="relative overflow-hidden pt-6 pb-16 md:py-16 px-4 md:px-12 max-w-7xl mx-auto border-b border-white/10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Columna Izquierda: Titular Editorial de Alta Moda & Scrapbook */}
            <div className="lg:col-span-7 space-y-6 md:space-y-8 z-10 text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/15 text-[11px] font-black uppercase tracking-widest text-zinc-900 dark:text-neon-amber shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-neon-amber animate-pulse" />
                <span>Colección '26 • Upcycling & Custom Studio</span>
              </div>

              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.9] text-zinc-900 dark:text-white">
                REPURPOSED <br />
                <span className="font-serif italic font-light text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 via-zinc-600 to-black dark:from-neon-amber dark:via-orange-400 dark:to-neon-purple">
                  ART & FASHION.
                </span>
              </h1>

              <p className="text-zinc-600 dark:text-zinc-400 text-base md:text-xl font-normal leading-relaxed max-w-xl">
                Collages llenos de sentimientos e intervención de piezas únicas. Transformamos prendas denim vintage y fabricamos accesorios indestructibles en <strong className="text-zinc-900 dark:text-white underline decoration-neon-amber decoration-2">caucho 100% reciclado</strong> de cámaras de bicicleta.
              </p>

              {/* Botones de acción editorial */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => {
                    setActiveTab('lab')
                    document.getElementById('catalogo-main')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="group px-8 py-4 rounded-full bg-zinc-900 dark:bg-neon-amber text-white dark:text-black font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-xl hover:scale-105 transition-all active:scale-95"
                >
                  <span>Entrar al Custom Lab</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => {
                    setActiveTab('rubber')
                    document.getElementById('catalogo-main')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="px-8 py-4 rounded-full bg-white dark:bg-dark-obsidian hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-300 dark:border-white/15 font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-md active:scale-95"
                >
                  <span>Ver Billeteras Acid Rubber</span>
                </button>
              </div>

              {/* Métricas / Trust badges estilo Editorial */}
              <div className="pt-6 grid grid-cols-3 gap-6 border-t border-zinc-200 dark:border-white/10 max-w-lg text-left">
                <div>
                  <span className="block text-2xl md:text-3xl font-black text-zinc-900 dark:text-white">100%</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Caucho Upcycled</span>
                </div>
                <div>
                  <span className="block text-2xl md:text-3xl font-black text-zinc-900 dark:text-white">1 of 1</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Piezas Únicas</span>
                </div>
                <div>
                  <span className="block text-2xl md:text-3xl font-black text-zinc-900 dark:text-white">📍 🇧🇴</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Taller Artesanal</span>
                </div>
              </div>
            </div>

            {/* Columna Derecha: Collage / Lookbook Image Showcase (Estilo Polaroid Scrapbook & Dribbble) */}
            <div className="lg:col-span-5 relative flex justify-center items-center">
              <div className="relative w-full max-w-md aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-zinc-800 bg-zinc-100 dark:bg-black group">
                <img
                  src="https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=1000&q=80"
                  alt="Upcycled Fashion Lookbook"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />

                {/* Badge Flotante Superior */}
                <div className="absolute top-4 left-4 bg-white/90 dark:bg-dark-obsidian/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-black/10 dark:border-white/15 shadow-lg flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-wider text-zinc-900 dark:text-white">
                  <span className="w-2 h-2 rounded-full bg-neon-green animate-ping" />
                  <span>Piezas Únicas en Stock</span>
                </div>

                {/* Tarjeta Flotante Scrapbook / Polaroid inferior */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 dark:bg-dark-obsidian/95 backdrop-blur-md p-4 rounded-2xl border border-black/10 dark:border-white/15 shadow-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Denim Intervenido</span>
                      <h4 className="font-black text-sm text-zinc-900 dark:text-white">Acid Wash Jacket '90s</h4>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-black text-zinc-900 dark:text-neon-amber">$65.00</span>
                      <span className="block text-[9px] font-bold text-green-600 dark:text-green-400">Disponible</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Elemento secundario superpuesto estilo Collage / Scrapbook */}
              <div className="hidden sm:block absolute -bottom-6 -right-6 w-44 aspect-square rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-zinc-800 rotate-6 hover:rotate-0 transition-transform bg-zinc-900">
                <img
                  src="https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=500&q=80"
                  alt="Acid Rubber Wallet"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                  <span className="text-[9px] font-extrabold text-white uppercase tracking-wider">Rubber Wallet #01</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            EDITORIAL HIGHLIGHTS & MANIFIESTO (FASHION STRIP)
            ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-white dark:bg-dark-card border border-zinc-200 dark:border-white/10 shadow-sm space-y-4 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-neon-purple/20 text-zinc-900 dark:text-neon-purple flex items-center justify-center font-black">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-black text-lg text-zinc-900 dark:text-white uppercase tracking-tight">Intervención de Autor</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
              Cada prenda del taller es tratada como un lienzo o collage sentimental. Elige entre bordados cyber, pintura acrílica UV reactiva y parches exclusivos.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-dark-card border border-zinc-200 dark:border-white/10 shadow-sm space-y-4 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-neon-green/20 text-zinc-900 dark:text-neon-green flex items-center justify-center font-black">
              <Recycle className="w-6 h-6" />
            </div>
            <h3 className="font-black text-lg text-zinc-900 dark:text-white uppercase tracking-tight">Caucho Indestructible</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
              Rescatamos cámaras de neumático de bicicleta. Limpieza cítrica profunda y confección artesanal para crear billeteras impermeables de durabilidad infinita.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-dark-card border border-zinc-200 dark:border-white/10 shadow-sm space-y-4 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-neon-amber/20 text-zinc-900 dark:text-neon-amber flex items-center justify-center font-black">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-black text-lg text-zinc-900 dark:text-white uppercase tracking-tight">Checkout QR Directo</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
              Paga en segundos con código QR interbancario o transferencia. Subes tu comprobante desde el celular y nuestro equipo lo valida en tiempo real.
            </p>
          </div>
        </section>

        {/* =========================================================================
            SECCIÓN PRINCIPAL: TABS EDITORIALES & CONFIGURADOR / CATÁLOGO
            ========================================================================= */}
        <section id="catalogo-main" className="max-w-7xl mx-auto px-4 md:px-12 space-y-12">
          {/* Cabecera & Tabs Editorial */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-200 dark:border-white/10 pb-8">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-zinc-500 dark:text-neon-amber">Colecciones & Custom Lab</span>
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-zinc-900 dark:text-white">
                Explora el Catálogo
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                  activeTab === 'all'
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-black shadow-lg scale-105'
                    : 'bg-zinc-100 dark:bg-dark-obsidian text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white border border-zinc-200 dark:border-white/10'
                }`}
              >
                🚀 Todo
              </button>

              <button
                onClick={() => setActiveTab('lab')}
                className={`px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                  activeTab === 'lab'
                    ? 'bg-zinc-900 dark:bg-neon-purple text-white dark:text-black shadow-lg scale-105'
                    : 'bg-zinc-100 dark:bg-dark-obsidian text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white border border-zinc-200 dark:border-white/10'
                }`}
              >
                ⚡ Custom Lab (Ropa)
              </button>

              <button
                onClick={() => setActiveTab('rubber')}
                className={`px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                  activeTab === 'rubber'
                    ? 'bg-zinc-900 dark:bg-neon-green text-white dark:text-black shadow-lg scale-105'
                    : 'bg-zinc-100 dark:bg-dark-obsidian text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white border border-zinc-200 dark:border-white/10'
                }`}
              >
                🖤 Billeteras Caucho
              </button>
            </div>
          </div>

          {/* Módulo 1: CONFIGURADOR DE CUSTOMIZACIÓN */}
          {(activeTab === 'all' || activeTab === 'lab') && (
            <div className="pt-2">
              <CustomLabConfigurator
                prendasStock={MOCK_PRENDAS_STOCK}
                modificadores={MOCK_MODIFICADORES}
                onAddCustomItemToCart={handleAddCustomItem}
              />
            </div>
          )}

          {/* Divisor elegante si ambas están visibles */}
          {activeTab === 'all' && <hr className="border-zinc-200 dark:border-white/10 my-16" />}

          {/* Módulo 2: CATÁLOGO DE BILLETERAS DE CAUCHO */}
          {(activeTab === 'all' || activeTab === 'rubber') && (
            <div className="pt-2">
              <AcidRubberCatalog
                billeteras={MOCK_BILLETERAS}
                onAddToCart={handleAddBilletera}
              />
            </div>
          )}
        </section>
      </main>

      <Footer />

      {/* Slide-over Drawer del Carrito */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={() => setCart([])}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* Modal de Pago QR */}
      <QRCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        onOrderSuccess={handleOrderSuccess}
      />
    </div>
  )
}
