'use client'

import React, { useState, useEffect } from 'react'
import { Navbar } from '@/components/ui/Navbar'
import { Footer } from '@/components/ui/Footer'
import { CustomLabConfigurator, PrendaBaseItem, ModificadorItem } from '@/components/shop/CustomLabConfigurator'
import { CartDrawer, CartItem } from '@/components/shop/CartDrawer'
import { QRCheckoutModal } from '@/components/checkout/QRCheckoutModal'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

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

export default function LaboratorioPage() {
  const router = useRouter()
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

  const [prendasStock, setPrendasStock] = useState<PrendaBaseItem[]>(MOCK_PRENDAS_STOCK)
  const [modificadores, setModificadores] = useState<ModificadorItem[]>(MOCK_MODIFICADORES)

  useEffect(() => {
    async function loadRealData() {
      try {
        const supabase = createClient()
        const [resRopa, resMods] = await Promise.all([
          supabase.from('productos_base').select('*').eq('is_active', true),
          supabase.from('modificadores').select('*').eq('is_active', true),
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
      } catch (err) {
        console.warn('Fallback a datos mock en laboratorio:', err)
      }
    }
    loadRealData()
  }, [])

  const handleAddCustomItem = (itemData: any) => {
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
  }

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Navbar cartCount={cart.reduce((a, b) => a + b.cantidad, 0)} onOpenCart={() => setIsCartOpen(true)} />
      <main className="flex-1 max-w-7xl mx-auto px-4 md:px-8 pt-12 pb-24 w-full">
        <CustomLabConfigurator
          prendasStock={prendasStock}
          modificadores={modificadores}
          onAddCustomItemToCart={handleAddCustomItem}
        />
      </main>
      <Footer />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onRemoveItem={(id) => setCart((prev) => prev.filter((i) => i.id !== id))}
        onClearCart={() => setCart([])}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      <QRCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        onOrderSuccess={(token) => {
          setIsCheckoutOpen(false)
          setCart([])
          router.push(`/pedido/${token}`)
        }}
      />
    </div>
  )
}
