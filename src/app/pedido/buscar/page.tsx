'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/ui/Navbar'
import { Footer } from '@/components/ui/Footer'
import { Search, ArrowRight, Layers, ShieldCheck } from 'lucide-react'

export default function BuscarPedidoPage() {
  const router = useRouter()
  const [tokenInput, setTokenInput] = useState('')

  const handleBuscar = (e: React.FormEvent) => {
    e.preventDefault()
    if (!tokenInput.trim()) return
    router.push(`/pedido/${tokenInput.trim()}`)
  }

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Navbar cartCount={0} onOpenCart={() => {}} />

      <main className="flex-1 max-w-2xl mx-auto px-4 pt-20 pb-32 w-full flex flex-col justify-center">
        <div className="glass-panel-neon p-8 sm:p-12 rounded-3xl border border-white/15 space-y-6 text-center shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-neon-amber/20 border border-neon-amber/40 text-neon-amber flex items-center justify-center mx-auto shadow-neon-amber">
            <Search className="w-7 h-7" />
          </div>

          <div>
            <h1 className="text-3xl font-black text-white uppercase tracking-tight">
              Rastrear Mi <span className="text-neon-amber">Pedido</span>
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-2 max-w-md mx-auto leading-relaxed">
              Ingresa el token de seguimiento o código de orden que recibiste al completar tu compra o en tu correo de confirmación.
            </p>
          </div>

          <form onSubmit={handleBuscar} className="space-y-4 pt-2">
            <input
              type="text"
              required
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="Ej: token-demo-1234  o UUID de tu orden"
              className="w-full bg-dark-obsidian border border-white/20 rounded-2xl px-5 py-4 text-center text-sm font-mono text-white placeholder:text-zinc-600 focus:outline-none focus:border-neon-amber shadow-inner"
            />

            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-neon-amber hover:bg-amber-400 text-black font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-neon-amber transition-all active:scale-95"
            >
              <span>Consultar Estatus en Vivo</span>
              <ArrowRight className="w-5 h-5 font-black" />
            </button>
          </form>

          <div className="pt-6 border-t border-white/10 flex items-center justify-center gap-4 text-[11px] text-zinc-500 font-medium">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-neon-green" />
              <span>Acceso sin contraseña</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-neon-purple" />
              <span>Actualización Instantánea</span>
            </span>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
