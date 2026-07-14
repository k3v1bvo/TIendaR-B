import React from 'react'
import Link from 'next/link'
import { Terminal, Shield, Recycle, Sparkles, Heart } from 'lucide-react'

export function Footer() {
  return (
    <footer className="w-full bg-dark-obsidian border-t border-white/10 pt-16 pb-12 px-4 md:px-8 mt-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/5">
        {/* Columna 1: Marca */}
        <div className="md:col-span-1 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-neon-amber flex items-center justify-center text-black font-black">
              <Terminal className="w-5 h-5" />
            </div>
            <span className="font-black text-lg tracking-wider uppercase text-white">
              Upcycling<span className="text-neon-amber">Lab</span>
            </span>
          </div>
          <p className="text-zinc-400 text-xs leading-relaxed">
            Laboratorio de intervención artística sobre prendas vintage y accesorios fabricados con caucho ultra-resistente reciclado de cámaras de bicicleta.
          </p>
          <div className="flex items-center gap-2 text-neon-green text-xs font-bold">
            <Recycle className="w-4 h-4" />
            <span>Manifiesto 100% Sostenible</span>
          </div>
        </div>

        {/* Columna 2: Navegación */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-300">Explorar</h4>
          <ul className="space-y-2 text-xs font-medium text-zinc-400">
            <li>
              <Link href="/laboratorio" className="hover:text-neon-amber transition-colors flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-neon-purple" />
                <span>Laboratorio de Ropa</span>
              </Link>
            </li>
            <li>
              <Link href="/billeteras" className="hover:text-neon-amber transition-colors flex items-center gap-1.5">
                <Shield className="w-3 h-3 text-neon-green" />
                <span>Billeteras de Caucho</span>
              </Link>
            </li>
            <li>
              <Link href="/pedido/buscar" className="hover:text-neon-amber transition-colors">
                Seguimiento de Pedidos QR
              </Link>
            </li>
          </ul>
        </div>

        {/* Columna 3: Seguridad & Pagos */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-300">Confianza & QR</h4>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Todas nuestras transferencias son verificadas de forma manual por nuestro equipo contable antes de iniciar la confección o el despacho.
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-neon-amber font-bold">
            🔒 Pago Seguro con QR Corporativo
          </div>
        </div>

        {/* Columna 4: Horarios & Taller */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-300">El Taller</h4>
          <p className="text-xs text-zinc-400">
            <strong className="text-white block mb-1">Horario de Confección:</strong>
            Lunes a Sábado — 10:00 a 19:00 hrs.
          </p>
          <p className="text-xs text-zinc-500 italic">
            *Cada pieza customizada toma entre 3 a 5 días hábiles en intervención artística manual.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-500 gap-4">
        <p>&copy; {new Date().getFullYear()} Upcycling Lab & Custom Shop S.R.L. — Todos los derechos reservados.</p>
        <div className="flex items-center gap-1 text-zinc-400 font-medium">
          <span>Diseñado con</span>
          <Heart className="w-3.5 h-3.5 text-neon-pink fill-neon-pink" />
          <span>en Antigravity Core (Dark Matte & Neon)</span>
        </div>
      </div>
    </footer>
  )
}
