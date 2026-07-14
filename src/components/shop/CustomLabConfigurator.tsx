'use client'

import React, { useState } from 'react'
import { Sparkles, Check, Scissors, Shirt, Clock, Plus, Tag } from 'lucide-react'

export interface PrendaBaseItem {
  id: string
  nombre: string
  tipo: string
  talla: string
  precio_base: number
  stock: number
  imagen_url: string
}

export interface ModificadorItem {
  id: string
  nombre: string
  categoria: string
  precio_extra: number
  imagen_referencia?: string
}

interface CustomLabConfiguratorProps {
  prendasStock: PrendaBaseItem[]
  modificadores: ModificadorItem[]
  onAddCustomItemToCart: (item: {
    tipo_item: 'prenda_stock' | 'prenda_propia'
    producto_base?: PrendaBaseItem
    nombre_item: string
    precio_unitario: number
    modificadores_seleccionados: ModificadorItem[]
    tematica_prenda_propia?: string
  }) => void
}

export function CustomLabConfigurator({
  prendasStock,
  modificadores,
  onAddCustomItemToCart,
}: CustomLabConfiguratorProps) {
  // Pestaña principal: Prenda del Stock vs Prenda Propia del Cliente
  const [mode, setMode] = useState<'stock' | 'propia'>('stock')

  // Selección en modo Stock
  const [selectedPrendaId, setSelectedPrendaId] = useState<string>(prendasStock[0]?.id || '')

  // Selección en modo Prenda Propia
  const [tipoPrendaPropia, setTipoPrendaPropia] = useState<string>('Chamarra Denim Propia')
  const [tematicaPropia, setTematicaPropia] = useState<string>('Cyberpunk / Acid Glow')

  // Modificadores elegidos (Set de IDs)
  const [selectedModIds, setSelectedModIds] = useState<string[]>([])
  const [isAdded, setIsAdded] = useState(false)

  const selectedPrenda = prendasStock.find((p) => p.id === selectedPrendaId) || prendasStock[0]

  const selectedModsList = modificadores.filter((m) => selectedModIds.includes(m.id))
  const totalExtras = selectedModsList.reduce((acc, curr) => acc + curr.precio_extra, 0)

  // Precio y cálculo final reactivo
  const precioBaseActual = mode === 'stock' ? (selectedPrenda?.precio_base || 0) : 35.0 // Costo base por recibir e intervenir prenda propia
  const precioTotalReactivo = precioBaseActual + totalExtras

  const toggleModificador = (id: string) => {
    setSelectedModIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleAdd = () => {
    if (mode === 'stock' && !selectedPrenda) return

    onAddCustomItemToCart({
      tipo_item: mode === 'stock' ? 'prenda_stock' : 'prenda_propia',
      producto_base: mode === 'stock' ? selectedPrenda : undefined,
      nombre_item: mode === 'stock'
        ? `${selectedPrenda.nombre} [Custom Lab]`
        : `${tipoPrendaPropia} (Intervención Estilo de la Casa)`,
      precio_unitario: precioTotalReactivo,
      modificadores_seleccionados: selectedModsList,
      tematica_prenda_propia: mode === 'propia' ? tematicaPropia : undefined,
    })

    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  return (
    <div className="w-full space-y-10">
      {/* Cabecera del Laboratorio */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-purple/10 border border-neon-purple/30 text-neon-purple text-xs font-black uppercase tracking-[0.2em] mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Upcycling & Custom Shop Configurator</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight uppercase">
            El Laboratorio <span className="text-neon-purple">de Ropa</span>
          </h2>
          <p className="text-zinc-400 text-sm mt-2 max-w-2xl">
            Escoge una prenda vintage de nuestro stock o envíanos tu propia pieza. Agrega bordados, pintura UV o parches para calcular el precio dinámico al instante.
          </p>
        </div>

        {/* Selector de Modo */}
        <div className="flex items-center gap-2 bg-dark-obsidian p-1.5 rounded-2xl border border-white/10">
          <button
            onClick={() => setMode('stock')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
              mode === 'stock'
                ? 'bg-neon-purple text-black shadow-neon-purple'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Shirt className="w-4 h-4" />
            <span>Prenda de Stock</span>
          </button>
          <button
            onClick={() => setMode('propia')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
              mode === 'propia'
                ? 'bg-neon-amber text-black shadow-neon-amber'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Scissors className="w-4 h-4" />
            <span>Enviar Mi Prenda</span>
          </button>
        </div>
      </div>

      {/* Grid de Configuración (2 Columnas: Selección izquierda | Resumen reactivo derecha) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Columna Izquierda: Opciones de Prenda Base & Modificadores (8 columnas) */}
        <div className="lg:col-span-8 space-y-8">
          {/* 1. SELECCIÓN DE PRENDA */}
          <div className="glass-panel p-6 rounded-2xl space-y-6 border border-white/10">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <h3 className="font-black text-base uppercase tracking-wider text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-neon-purple/20 text-neon-purple flex items-center justify-center text-xs">1</span>
                <span>{mode === 'stock' ? 'Selecciona la Prenda Base del Catálogo' : 'Detalles de Tu Prenda Propia'}</span>
              </h3>
              <span className="text-xs font-bold text-zinc-500 uppercase">
                {mode === 'stock' ? 'Piezas Vintage Únicas' : 'Servicio de Intervención'}
              </span>
            </div>

            {mode === 'stock' ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {prendasStock.map((prenda) => {
                  const isSelected = prenda.id === selectedPrendaId
                  return (
                    <div
                      key={prenda.id}
                      onClick={() => setSelectedPrendaId(prenda.id)}
                      className={`group relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all p-3 flex flex-col justify-between ${
                        isSelected
                          ? 'border-neon-purple bg-neon-purple/10 shadow-neon-purple'
                          : 'border-white/10 bg-dark-obsidian hover:border-white/30'
                      }`}
                    >
                      <div>
                        <div className="aspect-video w-full rounded-lg overflow-hidden bg-black mb-3">
                          <img
                            src={prenda.imagen_url}
                            alt={prenda.nombre}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <span className="text-[10px] font-bold uppercase text-neon-purple tracking-widest">
                          Talla: {prenda.talla}
                        </span>
                        <h4 className="font-black text-sm text-white line-clamp-1 mt-0.5">
                          {prenda.nombre}
                        </h4>
                      </div>

                      <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
                        <span className="font-black text-base text-white">
                          ${prenda.precio_base.toFixed(2)} USD
                        </span>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-neon-purple text-black flex items-center justify-center">
                            <Check className="w-3 h-3 font-black" />
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-2">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 block">
                    Tipo de Prenda que enviarás al taller:
                  </label>
                  <select
                    value={tipoPrendaPropia}
                    onChange={(e) => setTipoPrendaPropia(e.target.value)}
                    className="w-full bg-dark-obsidian border border-white/15 rounded-xl px-4 py-3 text-sm text-white font-medium focus:outline-none focus:border-neon-amber"
                  >
                    <option value="Chamarra Denim Propia">Chamarra de Mezclilla / Denim</option>
                    <option value="Pantalón Cargo / Jeans Propios">Jeans o Pantalón Cargo</option>
                    <option value="Hoodie / Sudadera Algodón">Hoodie o Sudadera Gruesa</option>
                    <option value="Chaleco de Cuero / Denim">Chaleco o Chamarra de Cuero</option>
                  </select>
                  <p className="text-[11px] text-zinc-500 mt-1">
                    *El costo de la intervención base y preparación de textil es de $35.00 USD.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 block">
                    Selecciona el 'Estilo de la Casa':
                  </label>
                  <select
                    value={tematicaPropia}
                    onChange={(e) => setTematicaPropia(e.target.value)}
                    className="w-full bg-dark-obsidian border border-white/15 rounded-xl px-4 py-3 text-sm text-white font-medium focus:outline-none focus:border-neon-amber"
                  >
                    <option value="Cyberpunk / Acid Glow">⚡ Cyberpunk / Acid Glow (Pintura UV + Tachas)</option>
                    <option value="Punk Grunge / Distress">🔥 Punk Grunge (Desgaste artesanal + Parches)</option>
                    <option value="Psicodélico 90s / Tie-Dye">🔮 Psicodélico 90s (Bordados dragón / mandalas)</option>
                    <option value="Industrial Black Matte">🖤 Industrial Black Matte (Acabado oscuro extremo)</option>
                  </select>
                  <p className="text-[11px] text-zinc-500 mt-1">
                    *Te contactaremos por WhatsApp para enviarte boceto digital previo.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* 2. SELECCIÓN DE MODIFICADORES INTERACTIVOS */}
          <div className="glass-panel p-6 rounded-2xl space-y-6 border border-white/10">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <h3 className="font-black text-base uppercase tracking-wider text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-neon-amber/20 text-neon-amber flex items-center justify-center text-xs">2</span>
                <span>Agrega Modificadores e Intervenciones Artísticas</span>
              </h3>
              <span className="text-xs font-bold text-neon-amber uppercase">
                {selectedModIds.length} Seleccionados (+${totalExtras.toFixed(2)})
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {modificadores.map((mod) => {
                const isChecked = selectedModIds.includes(mod.id)
                return (
                  <div
                    key={mod.id}
                    onClick={() => toggleModificador(mod.id)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                      isChecked
                        ? 'bg-neon-amber/10 border-neon-amber shadow-neon-amber'
                        : 'bg-dark-obsidian border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-colors ${
                          isChecked
                            ? 'bg-neon-amber border-neon-amber text-black'
                            : 'bg-black border-zinc-700 text-transparent'
                        }`}
                      >
                        <Check className="w-4 h-4 font-black" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase text-zinc-500 tracking-wider block">
                          {mod.categoria} {mod.imagen_referencia || '✨'}
                        </span>
                        <h4 className="font-bold text-sm text-white">{mod.nombre}</h4>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-black text-sm text-neon-amber">
                        +${mod.precio_extra.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Columna Derecha: Tarjeta del Cotizador y Desglose Reactivo (4 columnas sticky) */}
        <div className="lg:col-span-4 sticky top-24 space-y-6">
          <div className="glass-panel-neon p-6 rounded-2xl space-y-6 border border-neon-purple/40">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="font-black text-base uppercase tracking-wider text-white">
                Resumen del Diseño
              </h3>
              <span className="px-2.5 py-1 rounded-full bg-neon-purple text-black font-black text-[10px] uppercase tracking-wider">
                En Vivo
              </span>
            </div>

            {/* Previsualización del ítem */}
            <div className="space-y-3">
              <div className="aspect-video w-full rounded-xl overflow-hidden bg-black/60 relative border border-white/10">
                <img
                  src={mode === 'stock' ? selectedPrenda?.imagen_url : 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?auto=format&fit=crop&w=600&q=80'}
                  alt="Previsualización"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                  <span className="font-black text-xs text-white uppercase tracking-wider">
                    {mode === 'stock' ? selectedPrenda?.nombre : `${tipoPrendaPropia}`}
                  </span>
                </div>
              </div>

              {/* Tags de Modificadores en Vivo */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {selectedModsList.length === 0 ? (
                  <span className="text-xs text-zinc-500 italic">Sin modificadores extra (diseño base puro)</span>
                ) : (
                  selectedModsList.map((m) => (
                    <span
                      key={m.id}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neon-amber/20 border border-neon-amber/40 text-neon-amber text-[11px] font-bold"
                    >
                      <Tag className="w-3 h-3" />
                      <span>{m.nombre}</span>
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Desglose Económico */}
            <div className="space-y-3 pt-4 border-t border-white/10 text-xs">
              <div className="flex justify-between text-zinc-300">
                <span>{mode === 'stock' ? 'Precio Prenda Base' : 'Servicio Intervención Base'}</span>
                <span className="font-bold text-white">${precioBaseActual.toFixed(2)} USD</span>
              </div>
              <div className="flex justify-between text-zinc-300">
                <span>Modificadores ({selectedModsList.length})</span>
                <span className="font-bold text-neon-amber">+${totalExtras.toFixed(2)} USD</span>
              </div>
              <div className="pt-3 border-t border-white/10 flex justify-between items-end">
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500">Total Estimado</span>
                  <span className="text-3xl font-black text-white tracking-tight">
                    ${precioTotalReactivo.toFixed(2)} <span className="text-xs text-neon-purple font-bold">USD</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Tiempo Artesanal */}
            <div className="p-3 rounded-xl bg-dark-obsidian border border-white/10 flex items-center gap-3 text-zinc-400 text-xs">
              <Clock className="w-5 h-5 text-neon-amber shrink-0" />
              <span>
                Confección manual estimada en <strong className="text-white">3 a 5 días hábiles</strong> por nuestros artesanos.
              </span>
            </div>

            {/* Botón de Agregar */}
            <button
              onClick={handleAdd}
              className={`w-full py-4 rounded-xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl ${
                isAdded
                  ? 'bg-neon-green text-black shadow-neon-green'
                  : 'bg-gradient-to-r from-neon-purple via-violet-600 to-neon-amber text-black hover:opacity-95 shadow-neon-purple'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-5 h-5 font-black" />
                  <span>¡Diseño Agregado al Carrito!</span>
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5 font-black" />
                  <span>Guardar Diseño y Agregar</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
