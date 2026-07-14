'use client'

import React from 'react'
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react'
import { BilleteraItem } from './AcidRubberCatalog'
import { ModificadorItem } from './CustomLabConfigurator'

export interface CartItem {
  id: string
  tipo_item: 'prenda_stock' | 'prenda_propia' | 'billetera_caucho'
  nombre_item: string
  precio_unitario: number
  cantidad: number
  producto_base_id?: string
  billetera_id?: string
  imagen_url?: string
  modificadores_seleccionados?: ModificadorItem[]
  tematica_prenda_propia?: string
}

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
  items: CartItem[]
  onRemoveItem: (id: string) => void
  onClearCart: () => void
  onProceedToCheckout: () => void
}

export function CartDrawer({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
}: CartDrawerProps) {
  if (!isOpen) return null

  const total = items.reduce((acc, curr) => acc + curr.precio_unitario * curr.cantidad, 0)

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
      />

      {/* Drawer */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-dark-obsidian border-l border-white/10 shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-neon-amber" />
              <h3 className="font-black text-lg text-white tracking-wider uppercase">
                Tu Carrito <span className="text-neon-amber">({items.length})</span>
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body / Items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-600">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">El Carrito Está Vacío</h4>
                  <p className="text-xs text-zinc-500 mt-1">
                    Explora el Laboratorio de Customización o la Colección de Billeteras de Caucho para agregar piezas.
                  </p>
                </div>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-dark-card border border-white/10 hover:border-white/20 transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {item.imagen_url && (
                        <img
                          src={item.imagen_url}
                          alt={item.nombre_item}
                          className="w-12 h-12 rounded-lg object-cover bg-black border border-white/10"
                        />
                      )}
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-neon-amber block">
                          {item.tipo_item === 'billetera_caucho'
                            ? 'Billetera Caucho'
                            : item.tipo_item === 'prenda_stock'
                            ? 'Prenda Stock Custom'
                            : 'Prenda Propia'}
                        </span>
                        <h4 className="font-bold text-sm text-white line-clamp-1">{item.nombre_item}</h4>
                      </div>
                    </div>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="p-1.5 rounded-lg hover:bg-red-500/20 text-zinc-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Modificadores o Temática extra si los tiene */}
                  {item.modificadores_seleccionados && item.modificadores_seleccionados.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1 border-t border-white/5">
                      {item.modificadores_seleccionados.map((mod) => (
                        <span
                          key={mod.id}
                          className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-medium text-zinc-300"
                        >
                          + {mod.nombre} (${mod.precio_extra.toFixed(2)})
                        </span>
                      ))}
                    </div>
                  )}

                  {item.tematica_prenda_propia && (
                    <p className="text-[11px] text-neon-purple font-medium italic">
                      🎨 Temática: {item.tematica_prenda_propia}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-2 text-xs font-black">
                    <span className="text-zinc-400">Cant: {item.cantidad}</span>
                    <span className="text-white text-sm">
                      ${(item.precio_unitario * item.cantidad).toFixed(2)} USD
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer del Carrito */}
          {items.length > 0 && (
            <div className="p-6 border-t border-white/10 space-y-4 bg-dark-card/50">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>Subtotal ({items.length} ítems)</span>
                <span className="font-bold text-white">${total.toFixed(2)} USD</span>
              </div>
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>Envío / Despacho</span>
                <span className="text-neon-green font-bold">Por Coordinar en QR</span>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-sm font-black uppercase text-white">Total Final:</span>
                <span className="text-2xl font-black text-neon-amber tracking-tight">
                  ${total.toFixed(2)} <span className="text-xs text-white">USD</span>
                </span>
              </div>

              <button
                onClick={() => {
                  onClose()
                  onProceedToCheckout()
                }}
                className="w-full py-4 rounded-xl bg-neon-amber hover:bg-amber-400 text-black font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-neon-amber transition-all active:scale-95"
              >
                <span>Proceder a Pago QR</span>
                <ArrowRight className="w-4 h-4 font-black" />
              </button>

              <button
                onClick={onClearCart}
                className="w-full py-2 rounded-xl bg-transparent hover:bg-white/5 text-zinc-500 hover:text-zinc-300 font-bold text-xs uppercase tracking-wider transition-colors"
              >
                Vaciar Carrito
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
