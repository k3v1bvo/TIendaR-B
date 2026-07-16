'use client'

import React, { useState, useEffect } from 'react'
import { Navbar } from '@/components/ui/Navbar'
import { Footer } from '@/components/ui/Footer'
import { AcidRubberCatalog, BilleteraItem } from '@/components/shop/AcidRubberCatalog'
import { CartDrawer, CartItem } from '@/components/shop/CartDrawer'
import { QRCheckoutModal } from '@/components/checkout/QRCheckoutModal'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

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

export default function BilleterasPage() {
  const router = useRouter()
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

  const [billeteras, setBilleteras] = useState<BilleteraItem[]>(MOCK_BILLETERAS)

  useEffect(() => {
    async function loadRealData() {
      try {
        const supabase = createClient()
        const { data } = await supabase.from('billeteras_caucho').select('*').eq('is_active', true)

        if (data && data.length > 0) {
          setBilleteras(
            data.map((item: any) => ({
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
        console.warn('Fallback a datos mock en billeteras:', err)
      }
    }
    loadRealData()
  }, [])

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
  }

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Navbar cartCount={cart.reduce((a, b) => a + b.cantidad, 0)} onOpenCart={() => setIsCartOpen(true)} />
      <main className="flex-1 max-w-7xl mx-auto px-4 md:px-8 pt-12 pb-24 w-full">
        <AcidRubberCatalog billeteras={billeteras} onAddToCart={handleAddBilletera} />
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
