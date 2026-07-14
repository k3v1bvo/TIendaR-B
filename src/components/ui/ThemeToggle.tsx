'use client'

import React, { useEffect, useState } from 'react'
import { Moon, Sun, Sparkles, Palette } from 'lucide-react'

export type ThemeMode = 'cyber-dark' | 'editorial-light'

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>('cyber-dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem('upcycling-theme') as ThemeMode
    if (savedTheme === 'editorial-light' || savedTheme === 'cyber-dark') {
      setTheme(savedTheme)
      applyTheme(savedTheme)
    } else {
      applyTheme('cyber-dark')
    }
  }, [])

  const applyTheme = (mode: ThemeMode) => {
    const html = document.documentElement
    if (mode === 'editorial-light') {
      html.setAttribute('data-theme', 'editorial-light')
      html.classList.remove('dark')
      html.classList.add('theme-light')
    } else {
      html.setAttribute('data-theme', 'cyber-dark')
      html.classList.add('dark')
      html.classList.remove('theme-light')
    }
  }

  const toggleTheme = () => {
    const nextTheme: ThemeMode = theme === 'cyber-dark' ? 'editorial-light' : 'cyber-dark'
    setTheme(nextTheme)
    applyTheme(nextTheme)
    localStorage.setItem('upcycling-theme', nextTheme)
  }

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-xl bg-zinc-800/50 animate-pulse border border-white/5" />
    )
  }

  return (
    <button
      onClick={toggleTheme}
      title={theme === 'cyber-dark' ? 'Cambiar a Modo Claro / Editorial Fashion' : 'Cambiar a Modo Dark / Cyber'}
      className="group relative flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-all duration-300 font-bold text-xs uppercase tracking-wider active:scale-95 shadow-md overflow-hidden
      data-[theme=cyber-dark]:bg-dark-obsidian data-[theme=cyber-dark]:border-neon-amber/40 data-[theme=cyber-dark]:text-neon-amber data-[theme=cyber-dark]:hover:bg-zinc-800
      data-[theme=editorial-light]:bg-white data-[theme=editorial-light]:border-black/20 data-[theme=editorial-light]:text-black data-[theme=editorial-light]:hover:bg-zinc-100 data-[theme=editorial-light]:shadow-xl"
      data-theme={theme}
    >
      <div className="flex items-center justify-center transition-transform duration-500 group-hover:rotate-180">
        {theme === 'cyber-dark' ? (
          <Sun className="w-4 h-4 text-neon-amber shrink-0 animate-spin-slow" />
        ) : (
          <Moon className="w-4 h-4 text-black shrink-0" />
        )}
      </div>
      <span className="hidden md:inline font-extrabold">
        {theme === 'cyber-dark' ? '☀️ Claro / Editorial' : '🌙 Dark / Cyber'}
      </span>
      <span className="md:hidden font-extrabold text-[10px]">
        {theme === 'cyber-dark' ? '☀️' : '🌙'}
      </span>
    </button>
  )
}
