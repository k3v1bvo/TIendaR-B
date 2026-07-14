'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingBag, Sparkles, ShieldCheck, Layers, Terminal } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'

interface NavbarProps {
  cartCount: number
  onOpenCart: () => void
}

export function Navbar({ cartCount, onOpenCart }: NavbarProps) {
  const pathname = usePathname()

  const links = [
    { name: 'Laboratorio', href: '/laboratorio', icon: Sparkles, badge: 'Upcycling' },
    { name: 'Billeteras de Caucho', href: '/billeteras', icon: ShieldCheck, badge: 'Lote #01' },
    { name: 'Rastrear Pedido', href: '/pedido/buscar', icon: Layers },
  ]

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-white/10 px-4 md:px-8 py-4 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-amber via-orange-500 to-neon-purple flex items-center justify-center shadow-neon-amber group-hover:scale-105 transition-transform">
            <Terminal className="w-6 h-6 text-black font-black" />
          </div>
          <div>
            <span className="font-black text-lg md:text-xl tracking-wider uppercase text-white group-hover:text-neon-amber transition-colors">
              Upcycling<span className="text-neon-amber">Lab</span>
            </span>
            <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] -mt-1">
              Custom Shop & Rubber
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-2 bg-dark-obsidian/80 px-4 py-1.5 rounded-full border border-white/5">
          {links.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                  isActive
                    ? 'bg-neon-amber text-black shadow-neon-amber scale-105'
                    : 'text-zinc-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{link.name}</span>
                {link.badge && !isActive && (
                  <span className="text-[9px] bg-neon-purple/20 text-neon-purple border border-neon-purple/40 px-1.5 py-0.5 rounded-full">
                    {link.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Acciones derecha */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider text-zinc-400 hover:text-neon-amber hover:bg-neon-amber/10 border border-transparent hover:border-neon-amber/30 transition-all"
          >
            <span>🔐 Admin</span>
          </Link>

          <ThemeToggle />

          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl bg-dark-obsidian hover:bg-zinc-800 text-white font-black text-xs uppercase tracking-wider border border-white/10 hover:border-neon-amber/50 transition-all active:scale-95 shadow-lg"
          >
            <ShoppingBag className="w-4 h-4 text-neon-amber" />
            <span className="hidden sm:inline">Carrito</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-neon-amber text-black font-black text-xs flex items-center justify-center animate-bounce shadow-neon-amber">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Sub-bar */}
      <div className="flex md:hidden items-center justify-around mt-3 pt-3 border-t border-white/5">
        {links.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                isActive ? 'bg-neon-amber text-black' : 'text-zinc-400'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{link.name}</span>
            </Link>
          )
        })}
      </div>
    </header>
  )
}
