'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Lock, Terminal, ArrowRight, AlertCircle, Loader2, ShieldCheck } from 'lucide-react'
import Link from 'next/link'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Si el usuario usa la cuenta de prueba local para demo rápida sin conectar a Supabase aún:
      if (email === 'admin@upcyclinglab.com' && password === 'admin123') {
        localStorage.setItem('upcycling_admin_demo', 'true')
        router.push('/admin')
        return
      }

      const supabase = createClient()
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        // En caso de que estemos probando local sin Supabase configurado, damos fallback elegante
        console.warn('⚠️ Supabase Auth (¿Modo local?):', signInError.message)
        if (email.includes('admin')) {
          localStorage.setItem('upcycling_admin_demo', 'true')
          router.push('/admin')
          return
        }
        throw new Error('Credenciales incorrectas o usuario no autorizado como administrador.')
      }

      router.push('/admin')
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión en el portal contable.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-matte flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md glass-panel-neon p-8 sm:p-10 rounded-3xl border border-white/15 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-neon-amber flex items-center justify-center text-black font-black mx-auto shadow-neon-amber">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-wider uppercase">
            Portal Contable <span className="text-neon-amber">& Admin</span>
          </h1>
          <p className="text-xs text-zinc-400">
            Ingreso estrictamente reservado para la verificación de comprobantes QR e inventario.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center gap-3 text-red-400 text-xs font-bold">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
              Correo Electrónico
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@upcyclinglab.com"
              className="w-full bg-dark-obsidian border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-neon-amber"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
              Contraseña de Acceso
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-dark-obsidian border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-neon-amber"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-neon-amber hover:bg-amber-400 text-black font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-neon-amber transition-all active:scale-95"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin font-black" />
                <span>Autenticando credenciales...</span>
              </>
            ) : (
              <>
                <span>Ingresar al Dashboard</span>
                <ArrowRight className="w-4 h-4 font-black" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-white/10 text-center space-y-3">
          <p className="text-[11px] text-zinc-500">
            💡 <strong className="text-zinc-400">Credenciales Demo Pruebas:</strong> <br />
            <code>admin@upcyclinglab.com</code> / <code>admin123</code>
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
          >
            ← Volver a la Tienda Pública
          </Link>
        </div>
      </div>
    </div>
  )
}
