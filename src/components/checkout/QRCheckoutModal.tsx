'use client'

import React, { useState } from 'react'
import { X, QrCode, ShieldCheck, Download, AlertCircle, CheckCircle2, ArrowRight, Loader2, Lock } from 'lucide-react'
import { CartItem } from '@/components/shop/CartDrawer'
import { ImageUpload } from '@/components/ui/ImageUpload'
import { env } from '@/lib/env'

interface QRCheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  items: CartItem[]
  onOrderSuccess: (tokenAcceso: string) => void
}

export function QRCheckoutModal({ isOpen, onClose, items, onOrderSuccess }: QRCheckoutModalProps) {
  const [step, setStep] = useState<1 | 2>(1)

  // Datos del cliente
  const [clienteNombre, setClienteNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [telefono, setTelefono] = useState('')
  const [direccionEnvio, setDireccionEnvio] = useState('')
  const [notasCliente, setNotasCliente] = useState('')

  // Comprobante
  const [comprobanteUrl, setComprobanteUrl] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const total = items.reduce((acc, curr) => acc + curr.precio_unitario * curr.cantidad, 0)

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault()
    if (!clienteNombre || !correo || !telefono || !direccionEnvio) {
      setError('Por favor completa todos los campos obligatorios de contacto y envío.')
      return
    }
    setError(null)
    setStep(2)
  }

  const handleSubmitOrder = async () => {
    if (!comprobanteUrl) {
      setError('Por favor sube o toma la foto de tu comprobante QR para continuar.')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cliente_nombre: clienteNombre,
          correo,
          telefono,
          direccion_envio: direccionEnvio,
          notas_cliente: notasCliente,
          items,
          total,
          comprobante_url: comprobanteUrl,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Ocurrió un error al procesar tu pedido.')
      }

      onOrderSuccess(data.token_acceso)
    } catch (err: any) {
      console.error('Error en checkout:', err)
      setError(err.message || 'Error de conexión. Intenta de nuevo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity" />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-dark-obsidian border border-white/15 rounded-3xl shadow-2xl overflow-hidden z-10">
        {/* Cabecera superior */}
        <div className="bg-gradient-to-r from-dark-card via-dark-obsidian to-dark-card p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neon-green/20 border border-neon-green/40 flex items-center justify-center text-neon-green">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-lg text-white uppercase tracking-wider">
                Checkout <span className="text-neon-green">& Pago QR</span>
              </h3>
              <p className="text-xs text-zinc-400">Paso {step} de 2 — Verificación manual en el Laboratorio</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido principal */}
        <div className="p-6 sm:p-8 space-y-6">
          {error && (
            <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center gap-3 text-red-400 text-xs font-bold">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {step === 1 ? (
            /* PASO 1: DATOS GENERALES DE CONTACTO Y ENVÍO */
            <form onSubmit={handleNextStep} className="space-y-6">
              <div className="p-4 rounded-2xl bg-dark-card border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase text-zinc-400 block">Total a Cancelar</span>
                  <span className="text-2xl font-black text-neon-green">${total.toFixed(2)} USD</span>
                </div>
                <span className="text-xs text-zinc-400 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 font-bold">
                  {items.length} piezas seleccionadas
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={clienteNombre}
                    onChange={(e) => setClienteNombre(e.target.value)}
                    placeholder="Ej. Alex Rivera"
                    className="w-full bg-dark-card border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-neon-green"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    required
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    placeholder="alex@ejemplo.com"
                    className="w-full bg-dark-card border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-neon-green"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                    Teléfono / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    placeholder="+591 70000000"
                    className="w-full bg-dark-card border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-neon-green"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                    Dirección de Envío *
                  </label>
                  <input
                    type="text"
                    required
                    value={direccionEnvio}
                    onChange={(e) => setDireccionEnvio(e.target.value)}
                    placeholder="Calle, zona o sucursal de courier"
                    className="w-full bg-dark-card border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-neon-green"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                  Notas para el Artista / Medidas Específicas (Opcional)
                </label>
                <textarea
                  rows={2}
                  value={notasCliente}
                  onChange={(e) => setNotasCliente(e.target.value)}
                  placeholder="Detalles de colores para el bordado, o aclaraciones de envío..."
                  className="w-full bg-dark-card border border-white/15 rounded-xl p-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-neon-green resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-neon-green hover:bg-emerald-400 text-black font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-neon-green transition-all active:scale-95"
              >
                <span>Continuar al Pago QR</span>
                <ArrowRight className="w-5 h-5 font-black" />
              </button>
            </form>
          ) : (
            /* PASO 2: ESCANEO QR Y SUBIDA DEL COMPROBANTE */
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                {/* QR y descarga */}
                <div className="p-5 rounded-2xl bg-dark-card border border-white/10 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="w-44 h-44 rounded-2xl overflow-hidden bg-white p-3 shadow-lg flex items-center justify-center">
                    <img
                      src={env.NEXT_PUBLIC_CORPORATE_QR_URL}
                      alt="QR Corporativo"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>

                  <a
                    href={env.NEXT_PUBLIC_CORPORATE_QR_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    download="QR-UpcyclingLab.jpg"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-neon-green hover:underline"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Descargar Imagen QR</span>
                  </a>
                </div>

                {/* Datos bancarios e instrucciones */}
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-neon-green block">
                      Cuenta Oficial del Laboratorio
                    </span>
                    <h4 className="text-xl font-black text-white mt-0.5">{env.NEXT_PUBLIC_BANK_NAME}</h4>
                  </div>

                  <div className="space-y-2 text-xs text-zinc-300">
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                      <span className="text-[10px] text-zinc-500 uppercase font-bold block">Titular de la Cuenta:</span>
                      <span className="font-black text-white">{env.NEXT_PUBLIC_BANK_HOLDER}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                      <span className="text-[10px] text-zinc-500 uppercase font-bold block">Número / IBAN:</span>
                      <span className="font-mono font-bold text-neon-green">{env.NEXT_PUBLIC_BANK_ACCOUNT}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                      <span className="text-[10px] text-zinc-500 uppercase font-bold block">Monto Exacto a Transferir:</span>
                      <span className="font-black text-lg text-white">${total.toFixed(2)} USD</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Subida del comprobante */}
              <div className="space-y-3 pt-3 border-t border-white/10">
                <label className="text-xs font-bold uppercase tracking-wider text-white block flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-neon-green" />
                  <span>Sube la captura de pantalla o foto de tu transferencia *</span>
                </label>
                <ImageUpload
                  onImageUploaded={(url) => setComprobanteUrl(url)}
                  currentUrl={comprobanteUrl}
                />
              </div>

              <div className="flex items-center justify-between gap-4 pt-3">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setStep(1)}
                  className="px-5 py-3 rounded-xl bg-dark-card hover:bg-zinc-800 text-zinc-400 font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  ← Volver a Datos
                </button>

                <button
                  type="button"
                  disabled={isSubmitting || !comprobanteUrl}
                  onClick={handleSubmitOrder}
                  className={`flex-1 py-4 rounded-xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xl ${
                    isSubmitting || !comprobanteUrl
                      ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                      : 'bg-neon-green hover:bg-emerald-400 text-black shadow-neon-green active:scale-95'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin font-black" />
                      <span>Verificando y Creando Orden...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 font-black" />
                      <span>Confirmar Pedido & Enviar Comprobante</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
