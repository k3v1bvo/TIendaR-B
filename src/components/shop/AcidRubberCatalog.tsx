'use client'

import React, { useState } from 'react'
import { Shield, Sparkles, AlertTriangle, Check, Layers, ShoppingBag } from 'lucide-react'

export interface BilleteraItem {
  id: string
  nombre_diseno: string
  lote: string
  precio_fijo: number
  stock_disponible: number
  imagen_url: string
}

interface AcidRubberCatalogProps {
  billeteras: BilleteraItem[]
  onAddToCart: (item: BilleteraItem) => void
}

export function AcidRubberCatalog({ billeteras, onAddToCart }: AcidRubberCatalogProps) {
  const [selectedLote, setSelectedLote] = useState<string>('TODOS')
  const [addedId, setAddedId] = useState<string | null>(null)

  const lotesDisponibles = ['TODOS', ...Array.from(new Set(billeteras.map((b) => b.lote)))]

  const filteredBilleteras = selectedLote === 'TODOS'
    ? billeteras
    : billeteras.filter((b) => b.lote === selectedLote)

  const handleAdd = (item: BilleteraItem) => {
    if (item.stock_disponible <= 0) return
    onAddToCart(item)
    setAddedId(item.id)
    setTimeout(() => setAddedId(null), 1500)
  }

  return (
    <div className="w-full space-y-8">
      {/* Cabecera del catálogo */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-green/10 border border-neon-green/30 text-neon-green text-xs font-black uppercase tracking-[0.2em] mb-3">
            <Shield className="w-3.5 h-3.5" />
            <span>Caucho 100% Reciclado de Cámara de Bicicleta</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight uppercase">
            Acid Rubber <span className="text-neon-green">Collection</span>
          </h2>
          <p className="text-zinc-400 text-sm mt-2 max-w-2xl">
            Billeteras de alta resistencia, impermeables e indestructibles. Intervenidas con diseños psicodélicos y selladas por lotes numerados de stock estricto.
          </p>
        </div>

        {/* Filtros por Lote */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          <span className="text-xs font-bold uppercase text-zinc-500 mr-2 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" />
            Lote:
          </span>
          {lotesDisponibles.map((lote) => (
            <button
              key={lote}
              onClick={() => setSelectedLote(lote)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                selectedLote === lote
                  ? 'bg-neon-green text-black shadow-neon-green scale-105'
                  : 'bg-dark-obsidian text-zinc-400 hover:text-white border border-white/5 hover:border-white/20'
              }`}
            >
              {lote}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBilleteras.map((item) => {
          const isSoldOut = item.stock_disponible <= 0
          const isLowStock = item.stock_disponible > 0 && item.stock_disponible <= 3
          const isJustAdded = addedId === item.id

          return (
            <div
              key={item.id}
              className={`group relative rounded-2xl overflow-hidden transition-all duration-300 border ${
                isSoldOut
                  ? 'bg-zinc-950/80 border-zinc-800 opacity-70 grayscale'
                  : 'glass-panel hover:border-neon-green/60 hover:shadow-2xl hover:shadow-neon-green/10'
              }`}
            >
              {/* Imagen y Badges superior */}
              <div className="relative aspect-square w-full overflow-hidden bg-black/60">
                <img
                  src={item.imagen_url}
                  alt={item.nombre_diseno}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/10 text-white font-black text-[10px] uppercase tracking-widest">
                    {item.lote}
                  </span>
                </div>

                <div className="absolute top-3 right-3">
                  {isSoldOut ? (
                    <span className="px-3 py-1 rounded-full bg-red-600 text-white font-black text-[10px] uppercase tracking-widest shadow-lg flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      AGOTADO / SOLD OUT
                    </span>
                  ) : isLowStock ? (
                    <span className="px-3 py-1 rounded-full bg-neon-amber text-black font-black text-[10px] uppercase tracking-widest shadow-neon-amber animate-pulse flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      🔥 Solo quedan {item.stock_disponible}
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-neon-green/20 border border-neon-green/50 text-neon-green font-black text-[10px] uppercase tracking-widest backdrop-blur-md">
                      Stock: {item.stock_disponible} unid.
                    </span>
                  )}
                </div>
              </div>

              {/* Contenido e información */}
              <div className="p-5 space-y-4">
                <div>
                  <h3 className="font-black text-lg text-white tracking-wide group-hover:text-neon-green transition-colors">
                    {item.nombre_diseno}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-neon-green" />
                    <span>Costuras industriales de nylon triple tensión.</span>
                  </p>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500">Precio Fijo</span>
                    <span className="text-2xl font-black text-white tracking-tight">
                      ${item.precio_fijo.toFixed(2)} <span className="text-xs text-neon-green font-bold">USD</span>
                    </span>
                  </div>

                  <button
                    disabled={isSoldOut}
                    onClick={() => handleAdd(item)}
                    className={`px-5 py-3 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all active:scale-95 ${
                      isSoldOut
                        ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                        : isJustAdded
                        ? 'bg-neon-green text-black shadow-neon-green'
                        : 'bg-dark-obsidian hover:bg-neon-green hover:text-black text-white border border-white/15 hover:border-neon-green shadow-lg'
                    }`}
                  >
                    {isJustAdded ? (
                      <>
                        <Check className="w-4 h-4 text-black font-black" />
                        <span>¡Agregado!</span>
                      </>
                    ) : isSoldOut ? (
                      <span>Agotado</span>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Comprar</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
