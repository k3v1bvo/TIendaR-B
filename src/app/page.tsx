'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Navbar } from '@/components/ui/Navbar'
import { Footer } from '@/components/ui/Footer'
import { CustomLabConfigurator, PrendaBaseItem, ModificadorItem } from '@/components/shop/CustomLabConfigurator'
import { AcidRubberCatalog, BilleteraItem } from '@/components/shop/AcidRubberCatalog'
import { CartDrawer, CartItem } from '@/components/shop/CartDrawer'
import { QRCheckoutModal } from '@/components/checkout/QRCheckoutModal'
import { Sparkles, ShieldCheck, ArrowRight, Zap, Recycle, Shield, Heart, Eye, Star, CheckCircle2, MessageCircle, ExternalLink, Scissors, Layers, MapPin } from 'lucide-react'

function InstagramIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

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
    precio_fijo: 25.0,
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

  // Catálogos dinámicos desde Supabase con fallback local
  const [prendasStock, setPrendasStock] = useState<PrendaBaseItem[]>(MOCK_PRENDAS_STOCK)
  const [modificadores, setModificadores] = useState<ModificadorItem[]>(MOCK_MODIFICADORES)
  const [billeteras, setBilleteras] = useState<BilleteraItem[]>(MOCK_BILLETERAS)

  useEffect(() => {
    async function loadRealData() {
      try {
        const supabase = createClient()
        const [resRopa, resMods, resBilleteras] = await Promise.all([
          supabase.from('productos_base').select('*').eq('is_active', true),
          supabase.from('modificadores').select('*').eq('is_active', true),
          supabase.from('billeteras_caucho').select('*').eq('is_active', true),
        ])

        if (resRopa.data && resRopa.data.length > 0) {
          setPrendasStock(
            resRopa.data.map((item: any) => ({
              id: item.id,
              nombre: item.nombre,
              tipo: item.tipo,
              talla: item.talla,
              precio_base: Number(item.precio_base),
              stock: item.stock,
              imagen_url: item.imagen_url,
              galeria_urls: item.galeria_urls,
            }))
          )
        }
        if (resMods.data && resMods.data.length > 0) {
          setModificadores(
            resMods.data.map((item: any) => ({
              id: item.id,
              nombre: item.nombre,
              categoria: item.categoria,
              precio_extra: Number(item.precio_extra),
              imagen_referencia: item.imagen_referencia,
            }))
          )
        }
        if (resBilleteras.data && resBilleteras.data.length > 0) {
          setBilleteras(
            resBilleteras.data.map((item: any) => ({
              id: item.id,
              nombre_diseno: item.nombre_diseno,
              lote: item.lote,
              precio_fijo: Number(item.precio_fijo),
              stock_disponible: item.stock_disponible,
              imagen_url: item.imagen_url,
              galeria_urls: item.galeria_urls,
            }))
          )
        }
      } catch (err) {
        console.warn('Usando datos de demostración como fallback en HomePage:', err)
      }
    }
    loadRealData()
  }, [])

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

      <main className="flex-1 space-y-24 md:space-y-36">
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
                Collages llenos de sentimientos e intervención de piezas únicas en Bolivia 📍🇧🇴. Transformamos mezclilla vintage de los 90s y fabricamos accesorios de resistencia eterna en <strong className="text-zinc-900 dark:text-white underline decoration-neon-amber decoration-2">caucho 100% reciclado</strong> de cámaras de bicicleta.
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
                  <span>Explorar Catálogo & Lab</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <a
                  href="#historia"
                  className="px-8 py-4 rounded-full bg-white dark:bg-dark-obsidian hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-300 dark:border-white/15 font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-md active:scale-95"
                >
                  <span>📖 Conocer Nuestra Historia</span>
                </a>
              </div>

              {/* Métricas / Trust badges estilo Editorial */}
              <div className="pt-6 grid grid-cols-3 gap-6 border-t border-zinc-200 dark:border-white/10 max-w-lg text-left">
                <div>
                  <span className="block text-2xl md:text-3xl font-black text-zinc-900 dark:text-white">100%</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Upcycled Rubber</span>
                </div>
                <div>
                  <span className="block text-2xl md:text-3xl font-black text-zinc-900 dark:text-white">1 of 1</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Piezas Únicas</span>
                </div>
                <div>
                  <span className="block text-2xl md:text-3xl font-black text-zinc-900 dark:text-white">📍 🇧🇴</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Diseño en Bolivia</span>
                </div>
              </div>
            </div>

            {/* Columna Derecha: Collage / Lookbook Image Showcase */}
            <div className="lg:col-span-5 relative flex justify-center items-center">
              <div className="relative w-full max-w-md aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-zinc-800 bg-zinc-100 dark:bg-black group">
                <img
                  src="https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=1000&q=80"
                  alt="Upcycled Fashion Lookbook"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />

                <div className="absolute top-4 left-4 bg-white/90 dark:bg-dark-obsidian/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-black/10 dark:border-white/15 shadow-lg flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-wider text-zinc-900 dark:text-white">
                  <span className="w-2 h-2 rounded-full bg-neon-green animate-ping" />
                  <span>Piezas Únicas Disponibles</span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 bg-white/95 dark:bg-dark-obsidian/95 backdrop-blur-md p-4 rounded-2xl border border-black/10 dark:border-white/15 shadow-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Denim Intervenido</span>
                      <h4 className="font-black text-sm text-zinc-900 dark:text-white">Acid Wash Jacket '90s</h4>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-black text-zinc-900 dark:text-neon-amber">$65.00</span>
                      <span className="block text-[9px] font-bold text-green-600 dark:text-green-400">En Stock</span>
                    </div>
                  </div>
                </div>
              </div>

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
            SECCIÓN 1: QUIÉNES SOMOS & MANIFIESTO ("COLLAGES LLENOS DE SENTIMIENTOS")
            ========================================================================= */}
        <section id="historia" className="max-w-7xl mx-auto px-4 md:px-12 pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-white dark:bg-dark-card p-8 md:p-14 rounded-3xl border border-zinc-200 dark:border-white/10 shadow-lg">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-zinc-500 dark:text-neon-amber">
                <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                <span>Quiénes Somos • Manifiesto Artesanal</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-zinc-900 dark:text-white leading-tight">
                Collages Llenos de <br />
                <span className="font-serif italic font-light text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-pink-500 dark:from-neon-amber dark:to-neon-pink">
                  Sentimientos.
                </span>
              </h2>

              <div className="space-y-4 text-zinc-600 dark:text-zinc-300 text-sm md:text-base leading-relaxed font-normal">
                <p>
                  En <strong>Upcycling Lab & Custom Shop</strong> creemos que la ropa y los objetos que llevamos a diario deben tener un alma, una historia y una rebeldía propia. No somos una fábrica de moda rápida ni producimos plástico nuevo.
                </p>
                <p>
                  Rescatamos chamarras de mezclilla de los años 90 y 2000 que el mundo olvidó, y recolectamos cámaras de neumático de bicicleta destinadas a contaminar los basureros. Las limpiamos con procesos orgánicos, las restauramos y las intervenimos manualmente.
                </p>
                <p className="border-l-4 border-zinc-900 dark:border-neon-amber pl-4 italic font-medium text-zinc-900 dark:text-white">
                  "Cada parche cosido, cada trazo de pintura neón reactiva al UV y cada textura de caucho es un collage emocional irrepetible. Confeccionamos piezas para toda la vida desde nuestro taller en Bolivia 📍🇧🇴."
                </p>
              </div>

              <div className="pt-2 flex items-center gap-6">
                <a
                  href="#comunidad"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white font-black text-xs uppercase tracking-widest shadow-lg hover:scale-105 transition-transform"
                >
                  <InstagramIcon className="w-4 h-4" />
                  <span>Seguir nuestras Redes Sociales (Pronto)</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-md border border-black/10 dark:border-white/10">
                  <img src="https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=600&q=80" alt="Taller Upcycling 1" className="w-full h-full object-cover" />
                </div>
                <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-black/50 border border-black/5 text-center">
                  <span className="block text-xs font-black uppercase text-zinc-900 dark:text-white">Mezclilla Vintage</span>
                  <span className="text-[10px] text-zinc-500">Rescate 1 of 1</span>
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-md border border-black/10 dark:border-white/10">
                  <img src="https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80" alt="Taller Upcycling 2" className="w-full h-full object-cover" />
                </div>
                <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-black/50 border border-black/5 text-center">
                  <span className="block text-xs font-black uppercase text-zinc-900 dark:text-white">Acid Rubber</span>
                  <span className="text-[10px] text-zinc-500">Caucho Indestructible</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECCIÓN 2: CÓMO TRABAJAMOS & PROCESO EN 4 PASOS
            ========================================================================= */}
        <section id="proceso" className="max-w-7xl mx-auto px-4 md:px-12 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 dark:text-neon-amber">El Proceso de Creación</span>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-zinc-900 dark:text-white">
              De Desecho a Obra de Arte
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm md:text-base font-normal">
              Así transformamos cada prenda vintage o cámara de bicicleta en nuestro laboratorio digital y físico.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-8 rounded-3xl bg-white dark:bg-dark-card border border-zinc-200 dark:border-white/10 shadow-sm space-y-4 relative overflow-hidden group hover:border-zinc-400 dark:hover:border-white/30 transition-all">
              <span className="absolute -right-3 -top-3 text-7xl font-black text-zinc-100 dark:text-white/5 pointer-events-none group-hover:text-zinc-200 transition-colors">01</span>
              <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-neon-purple/20 text-zinc-900 dark:text-neon-purple flex items-center justify-center font-black">
                <Scissors className="w-6 h-6" />
              </div>
              <h3 className="font-black text-base text-zinc-900 dark:text-white uppercase tracking-tight">Rescate & Limpieza</h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
                Selección manual de chamarras oversize y triple lavado cítrico antibacterial de cámaras de caucho para asegurar máxima higiene y textura suave.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white dark:bg-dark-card border border-zinc-200 dark:border-white/10 shadow-sm space-y-4 relative overflow-hidden group hover:border-zinc-400 dark:hover:border-white/30 transition-all">
              <span className="absolute -right-3 -top-3 text-7xl font-black text-zinc-100 dark:text-white/5 pointer-events-none group-hover:text-zinc-200 transition-colors">02</span>
              <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-neon-amber/20 text-zinc-900 dark:text-neon-amber flex items-center justify-center font-black">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-black text-base text-zinc-900 dark:text-white uppercase tracking-tight">Intervención & Collage</h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
                Aplicamos bordados dorsales, parches de autor y pintura neón UV reactiva. Puedes elegir tu combinación aquí mismo en nuestro configurador digital.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white dark:bg-dark-card border border-zinc-200 dark:border-white/10 shadow-sm space-y-4 relative overflow-hidden group hover:border-zinc-400 dark:hover:border-white/30 transition-all">
              <span className="absolute -right-3 -top-3 text-7xl font-black text-zinc-100 dark:text-white/5 pointer-events-none group-hover:text-zinc-200 transition-colors">03</span>
              <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-neon-green/20 text-zinc-900 dark:text-neon-green flex items-center justify-center font-black">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="font-black text-base text-zinc-900 dark:text-white uppercase tracking-tight">Confección Indestructible</h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
                Costuras de hilo nylon de grado industrial y herrajes metálicos. Nuestras billeteras de caucho son 100% impermeables y no se desgastan jamás.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white dark:bg-dark-card border border-zinc-200 dark:border-white/10 shadow-sm space-y-4 relative overflow-hidden group hover:border-zinc-400 dark:hover:border-white/30 transition-all">
              <span className="absolute -right-3 -top-3 text-7xl font-black text-zinc-100 dark:text-white/5 pointer-events-none group-hover:text-zinc-200 transition-colors">04</span>
              <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-neon-pink/20 text-zinc-900 dark:text-neon-pink flex items-center justify-center font-black">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-black text-base text-zinc-900 dark:text-white uppercase tracking-tight">Pago QR & Envío</h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
                Sin comisiones de tarjetas. Pagas con tu aplicación bancaria (QR directa), subes la captura y te enviamos tu pieza con código de seguimiento en vivo.
              </p>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECCIÓN 3: COMUNIDAD & COLLABS POR DM (UPCYCLING LAB)
            ========================================================================= */}
        <section id="comunidad" className="max-w-7xl mx-auto px-4 md:px-12">
          <div className="p-8 md:p-14 rounded-3xl bg-gradient-to-r from-zinc-900 via-black to-zinc-900 text-white shadow-2xl border border-white/15 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/20 text-pink-400 text-xs font-black uppercase tracking-wider">
                <InstagramIcon className="w-3.5 h-3.5" />
                <span>Comunidad & Scrapbook Studio</span>
              </div>
              <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-tight">
                ¿Tienes un Proyecto Especial o Quieres Colaborar?
              </h3>
              <p className="text-zinc-400 text-sm md:text-base max-w-2xl font-normal leading-relaxed">
                Si eres artista, músico, tienes un diseño loco en mente, o simplemente quieres enviarnos tu propia chamarra para que le hagamos un collage a mano en nuestro taller, escríbenos por mensaje directo (DM).
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
              <a
                href="#comunidad"
                className="w-full py-4 px-6 rounded-2xl bg-white text-black font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl hover:bg-zinc-200 transition-all text-center active:scale-95"
              >
                <InstagramIcon className="w-4 h-4 text-pink-600" />
                <span>Instagram del Taller (Próximamente)</span>
              </a>

              <a
                href="#comunidad"
                className="w-full py-4 px-6 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 border border-white/10 transition-all text-center active:scale-95"
              >
                <MessageCircle className="w-4 h-4 text-green-400" />
                <span>Pedir Collab / DM Directo</span>
              </a>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECCIÓN PRINCIPAL: TABS EDITORIALES & CONFIGURADOR / CATÁLOGO
            ========================================================================= */}
        <section id="catalogo-main" className="max-w-7xl mx-auto px-4 md:px-12 space-y-12 pt-6">
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
                prendasStock={prendasStock}
                modificadores={modificadores}
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
                billeteras={billeteras}
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
