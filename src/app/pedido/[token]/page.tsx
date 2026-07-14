'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Navbar } from '@/components/ui/Navbar'
import { Footer } from '@/components/ui/Footer'
import { createClient } from '@/lib/supabase/client'
import { CheckCircle2, Clock, Truck, ShieldCheck, AlertCircle, ArrowLeft, Loader2, Sparkles, QrCode } from 'lucide-react'

interface PedidoDetalle {
  id: string
  token_acceso: string
  cliente_nombre: string
  correo: string
  telefono: string
  direccion_envio: string
  tipo_pedido: string
  total: number
  estado: string
  created_at: string
  pago_qr?: {
    comprobante_url: string
    estado_verificacion: string
    verificado_en?: string
  }
}

export default function PedidoTrackingPage() {
  const params = useParams()
  const router = useRouter()
  const token = params?.token as string

  const [pedido, setPedido] = useState<PedidoDetalle | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPedido() {
      if (!token) return
      setLoading(true)

      try {
        const supabase = createClient()
        // Buscar el pedido por token_acceso
        const { data, error: dbError } = await supabase
          .from('pedidos')
          .select(`
            *,
            pagos_qr (comprobante_url, estado_verificacion, verificado_en)
          `)
          .eq('token_acceso', token)
          .single()

        if (dbError || !data) {
          // Si estamos en modo demo local sin conectar Supabase aún o con token demo:
          if (token.startsWith('token-demo-') || token === 'demo') {
            setPedido({
              id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
              token_acceso: token,
              cliente_nombre: 'Alex Rivera (Demo)',
              correo: 'alex@ejemplo.com',
              telefono: '+591 70000000',
              direccion_envio: 'Zona Sur, Av. Principal #123',
              tipo_pedido: 'mixto',
              total: 100.0,
              estado: 'en_proceso',
              created_at: new Date().toISOString(),
              pago_qr: {
                comprobante_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
                estado_verificacion: 'verificado',
                verificado_en: new Date().toISOString(),
              },
            })
            setLoading(false)
            return
          }
          throw new Error('No se encontró ninguna orden con este token de seguimiento.')
        }

        setPedido({
          ...data,
          pago_qr: Array.isArray(data.pagos_qr) ? data.pagos_qr[0] : data.pagos_qr,
        })
      } catch (err: any) {
        console.error('Error buscando pedido:', err)
        setError(err.message || 'Error al obtener la información de seguimiento.')
      } finally {
        setLoading(false)
      }
    }

    fetchPedido()
  }, [token])

  const steps = [
    {
      id: 'pendiente_pago',
      title: 'Comprobante Subido',
      desc: 'El pago QR fue recibido y está en cola de revisión.',
      icon: Clock,
      done: true,
    },
    {
      id: 'en_verificacion',
      title: 'Auditoría Contable',
      desc: 'Revisión manual del monto por nuestro equipo.',
      icon: ShieldCheck,
      done: pedido?.pago_qr?.estado_verificacion === 'verificado' || pedido?.estado === 'en_proceso' || pedido?.estado === 'enviado' || pedido?.estado === 'completado',
    },
    {
      id: 'en_proceso',
      title: 'En Laboratorio / Confección',
      desc: 'La prenda está siendo intervenida por el artista o la billetera apartada del lote.',
      icon: Sparkles,
      done: pedido?.estado === 'en_proceso' || pedido?.estado === 'enviado' || pedido?.estado === 'completado',
    },
    {
      id: 'enviado',
      title: 'Despachado / En Ruta',
      desc: 'Paquete entregado a la empresa de mensajería para llegar a tus manos.',
      icon: Truck,
      done: pedido?.estado === 'enviado' || pedido?.estado === 'completado',
    },
  ]

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Navbar cartCount={0} onOpenCart={() => {}} />

      <main className="flex-1 max-w-4xl mx-auto px-4 md:px-8 pt-12 pb-24 w-full space-y-8">
        {/* Cabecera de Regreso */}
        <button
          onClick={() => router.push('/')}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a la Tienda</span>
        </button>

        {loading ? (
          <div className="glass-panel p-16 rounded-3xl flex flex-col items-center justify-center text-center space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-neon-amber" />
            <p className="font-bold text-sm text-zinc-300 uppercase tracking-wider">Cargando Trazabilidad...</p>
          </div>
        ) : error ? (
          <div className="glass-panel p-12 rounded-3xl text-center space-y-4 border border-red-500/30 bg-red-500/5">
            <div className="w-16 h-16 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="font-black text-xl text-white">Orden No Encontrada</h3>
            <p className="text-sm text-zinc-400 max-w-md mx-auto">{error}</p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 rounded-xl bg-neon-amber text-black font-black text-xs uppercase tracking-wider shadow-neon-amber"
            >
              Ir al Inicio
            </button>
          </div>
        ) : pedido ? (
          <div className="space-y-8">
            {/* Banner de Estado General */}
            <div className="glass-panel-neon p-6 sm:p-8 rounded-3xl border border-neon-amber/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-amber/20 border border-neon-amber/40 text-neon-amber text-xs font-black uppercase tracking-wider">
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Seguimiento en Tiempo Real</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase">
                  Orden #{pedido.id.slice(0, 8)}
                </h1>
                <p className="text-xs text-zinc-400">
                  Registrado para <strong className="text-white">{pedido.cliente_nombre}</strong> el {new Date(pedido.created_at).toLocaleDateString()}
                </p>
              </div>

              <div className="text-right bg-dark-obsidian/80 px-6 py-4 rounded-2xl border border-white/10 w-full sm:w-auto">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500">Monto Total</span>
                <span className="text-3xl font-black text-neon-green">${pedido.total.toFixed(2)} USD</span>
              </div>
            </div>

            {/* Timeline Visual de los 4 pasos */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
              <h3 className="font-black text-base uppercase tracking-wider text-white border-b border-white/10 pb-4">
                Progreso del Pedido & Verificación QR
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
                {steps.map((st, idx) => {
                  const Icon = st.icon
                  return (
                    <div
                      key={st.id}
                      className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                        st.done
                          ? 'bg-neon-green/10 border-neon-green/50 text-white shadow-lg'
                          : 'bg-dark-card/50 border-white/5 text-zinc-500'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                            st.done ? 'bg-neon-green text-black font-black' : 'bg-black text-zinc-600'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-wider">
                          Paso {idx + 1}
                        </span>
                      </div>
                      <div>
                        <h4 className={`font-black text-xs uppercase tracking-wider ${st.done ? 'text-neon-green' : 'text-zinc-400'}`}>
                          {st.title}
                        </h4>
                        <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                          {st.desc}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Detalle del Envío y Comprobante */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
                <h3 className="font-black text-sm uppercase tracking-wider text-white border-b border-white/10 pb-3">
                  📍 Datos de Despacho
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-zinc-400">Cliente:</span>
                    <span className="font-bold text-white">{pedido.cliente_nombre}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-zinc-400">Correo:</span>
                    <span className="font-bold text-white">{pedido.correo}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-zinc-400">Teléfono / WhatsApp:</span>
                    <span className="font-bold text-white">{pedido.telefono}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-zinc-400">Dirección:</span>
                    <span className="font-bold text-white text-right">{pedido.direccion_envio}</span>
                  </div>
                </div>
              </div>

              <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
                <h3 className="font-black text-sm uppercase tracking-wider text-white border-b border-white/10 pb-3 flex items-center justify-between">
                  <span>📄 Comprobante QR</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                    pedido.pago_qr?.estado_verificacion === 'verificado'
                      ? 'bg-neon-green text-black'
                      : 'bg-neon-amber text-black'
                  }`}>
                    {pedido.pago_qr?.estado_verificacion?.toUpperCase() || 'REVISANDO'}
                  </span>
                </h3>

                {pedido.pago_qr?.comprobante_url ? (
                  <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black/60 border border-white/10 flex items-center justify-center">
                    <img
                      src={pedido.pago_qr.comprobante_url}
                      alt="Comprobante Subido"
                      className="object-contain max-h-44 w-full"
                    />
                  </div>
                ) : (
                  <p className="text-xs text-zinc-500 italic">No hay imagen adjunta disponible.</p>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </main>

      <Footer />
    </div>
  )
}
