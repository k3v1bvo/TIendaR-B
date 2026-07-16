'use client'

import React from 'react'
import Link from 'next/link'
import { Terminal, Shield, Recycle, Sparkles, Heart, MessageCircle, Share2, MapPin, ExternalLink } from 'lucide-react'
import { useStoreConfig } from '@/hooks/useStoreConfig'

function InstagramIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

export function Footer() {
  const { config } = useStoreConfig()

  return (
    <footer className="w-full bg-zinc-900 dark:bg-dark-obsidian border-t border-zinc-800 dark:border-white/10 pt-16 pb-12 px-4 md:px-12 mt-28 text-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 pb-14 border-b border-zinc-800 dark:border-white/10">
        {/* Columna 1: Marca y Manifiesto */}
        <div className="md:col-span-1 space-y-4">
          <Link href="/" className="flex items-center gap-3 group">
            {config.logo_url ? (
              <img
                src={config.logo_url}
                alt={config.nombre_tienda}
                className="w-9 h-9 rounded-xl object-cover border border-white/20 group-hover:scale-105 transition-transform shadow-neon-amber"
              />
            ) : (
              <div className="w-9 h-9 rounded-xl bg-neon-amber flex items-center justify-center text-black font-black group-hover:scale-105 transition-transform shadow-neon-amber">
                <Terminal className="w-5 h-5" />
              </div>
            )}
            <div>
              <span className="font-black text-lg tracking-wider uppercase text-white group-hover:text-neon-amber transition-colors">
                {config.nombre_tienda}
              </span>
              <span className="block text-[9px] font-extrabold text-zinc-400 uppercase tracking-[0.2em]">
                {config.subtitulo_tienda}
              </span>
            </div>
          </Link>
          <p className="text-zinc-400 text-xs leading-relaxed font-normal">
            📍🇧🇴 <strong className="text-white">Collages llenos de sentimientos.</strong> Taller de intervención artística sobre prendas vintage y accesorios fabricados en caucho 100% reciclado de cámaras de bicicleta.
          </p>
          <div className="flex items-center gap-2 text-neon-green text-xs font-bold pt-1">
            <Recycle className="w-4 h-4 shrink-0" />
            <span>Manifiesto 100% Circular & Artesanal</span>
          </div>
        </div>

        {/* Columna 2: Redes Sociales & Collabs por DM */}
        <div className="space-y-4">
          <h4 className="text-xs font-black uppercase tracking-[0.2em] text-neon-amber flex items-center gap-2">
            <Share2 className="w-3.5 h-3.5" />
            <span>Redes & Collabs</span>
          </h4>
          <ul className="space-y-3 text-xs font-medium text-zinc-300">
            <li>
              <a
                href={config.instagram_url || '#comunidad'}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-neon-amber transition-colors flex items-center gap-2 group"
              >
                <div className="w-6 h-6 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center group-hover:bg-pink-500 group-hover:text-white transition-colors">
                  <InstagramIcon className="w-3.5 h-3.5" />
                </div>
                <span>Instagram Oficial</span>
                <ExternalLink className="w-3 h-3 text-zinc-500 group-hover:text-white ml-auto" />
              </a>
            </li>
            <li>
              <a
                href={`https://wa.me/${config.whatsapp_number?.replace(/[^0-9]/g, '') || '59170000000'}?text=Hola,%20quisiera%20consultar%20sobre%20sus%20diseños%20upcycling`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-neon-amber transition-colors flex items-center gap-2 group"
              >
                <div className="w-6 h-6 rounded-lg bg-green-500/20 text-green-400 flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition-colors">
                  <MessageCircle className="w-3.5 h-3.5" />
                </div>
                <span>Pedir Collab / WhatsApp Directo</span>
                <ExternalLink className="w-3 h-3 text-zinc-500 group-hover:text-white ml-auto" />
              </a>
            </li>
            <li>
              <div className="flex items-center gap-2 text-zinc-400 pt-1">
                <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span className="text-[11px]">Envíos a todo el país desde Bolivia 🇧🇴</span>
              </div>
            </li>
          </ul>
        </div>

        {/* Columna 3: Explorar Catálogo & Secciones */}
        <div className="space-y-4">
          <h4 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-300">Explorar El Taller</h4>
          <ul className="space-y-2.5 text-xs font-medium text-zinc-400">
            <li>
              <a href="#historia" className="hover:text-white transition-colors flex items-center gap-1.5">
                <span>📖 Quiénes Somos & Manifiesto</span>
              </a>
            </li>
            <li>
              <a href="#proceso" className="hover:text-white transition-colors flex items-center gap-1.5">
                <span>⚙️ Cómo Intervenimos (4 Pasos)</span>
              </a>
            </li>
            <li>
              <Link href="/laboratorio" className="hover:text-neon-amber transition-colors flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-neon-purple" />
                <span>Laboratorio de Ropa Custom</span>
              </Link>
            </li>
            <li>
              <Link href="/billeteras" className="hover:text-neon-amber transition-colors flex items-center gap-1.5">
                <Shield className="w-3 h-3 text-neon-green" />
                <span>Colección Acid Rubber</span>
              </Link>
            </li>
            <li>
              <Link href="/pedido/buscar" className="hover:text-neon-amber transition-colors">
                🔍 Rastrear mi Pedido con QR
              </Link>
            </li>
          </ul>
        </div>

        {/* Columna 4: Confianza, Horarios & Talleres */}
        <div className="space-y-4">
          <h4 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-300">Confianza & Taller</h4>
          <p className="text-xs text-zinc-400 leading-relaxed font-normal">
            Cada pieza que sale de nuestras manos es irrepetible (`1 of 1`). Pagas sin comisiones ocultas mediante QR o transferencia directa.
          </p>
          <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-[11px] text-zinc-300 space-y-1">
            <span className="text-neon-amber font-bold block">⏱️ Horario de Atención & DM:</span>
            <span>Lunes a Sábado — 10:00 a 20:00 hrs.</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
        <p>&copy; {new Date().getFullYear()} Upcycling Lab & Custom Shop S.R.L. — Todos los derechos reservados.</p>
        <div className="flex items-center gap-1.5 text-zinc-400 font-medium text-[11px]">
          <span>Confeccionado artesanalmente con</span>
          <Heart className="w-3.5 h-3.5 text-neon-pink fill-neon-pink animate-pulse" />
          <span>en Bolivia para el mundo</span>
        </div>
      </div>
    </footer>
  )
}
