'use client'

import { useState, useEffect } from 'react'

export interface StoreConfig {
  nombre_tienda: string
  subtitulo_tienda: string
  logo_url: string
  tagline_hero: string
  descripcion_hero: string
  imagen_hero_url: string
  titulo_que_hacemos: string
  texto_que_hacemos: string
  imagen_que_hacemos_url: string
  instagram_url: string
  tiktok_url: string
  whatsapp_number: string
}

const DEFAULT_CONFIG: StoreConfig = {
  nombre_tienda: 'UpcyclingLab',
  subtitulo_tienda: 'Custom Shop & Rubber S.R.L.',
  logo_url: '',
  tagline_hero: 'REBELDÍA SOSTENIBLE & DISEÑO ÚNICO',
  descripcion_hero: 'Transformamos prendas vintage en desuso y cámaras de caucho industrial en piezas únicas de alta costura urbana. Cada diseño es irrepetible y hecho a mano.',
  imagen_hero_url: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?auto=format&fit=crop&w=1600&q=80',
  titulo_que_hacemos: '¿A QUÉ NOS DEDICAMOS?',
  texto_que_hacemos: 'Somos un laboratorio creativo y taller de confección upcycling. Tomamos chaquetas de mezclilla, pantalones cargo y caucho recuperado de vehículos para rediseñar prendas con tachas, pintura acrílica neón, bordados artesanales y parches exclusivos. No hacemos moda rápida: creamos arte para vestir.',
  imagen_que_hacemos_url: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=80',
  instagram_url: 'https://instagram.com',
  tiktok_url: 'https://tiktok.com',
  whatsapp_number: '+59170000000',
}

export function useStoreConfig() {
  const [config, setConfig] = useState<StoreConfig>(DEFAULT_CONFIG)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadConfig() {
      try {
        const res = await fetch('/api/admin/configuracion')
        if (res.ok) {
          const data = await res.json()
          setConfig({ ...DEFAULT_CONFIG, ...data })
        }
      } catch (e) {
        console.warn('Usando configuración por defecto del sitio:', e)
      } finally {
        setLoading(false)
      }
    }
    loadConfig()
  }, [])

  return { config, setConfig, loading }
}
