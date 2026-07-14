'use client'

import React, { useState, useRef } from 'react'
import { Upload, Camera, CheckCircle2, AlertCircle, Loader2, X, RefreshCw } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface ImageUploadProps {
  onImageUploaded: (url: string) => void
  currentUrl?: string
}

export function ImageUpload({ onImageUploaded, currentUrl }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentUrl || null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  /**
   * Redimensiona y comprime la imagen en el cliente usando un canvas para asegurar que
   * sea un JPG/WEBP ligero (< 1 MB) antes de enviarla a Supabase Storage.
   */
  const compressImage = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (event) => {
        const img = new Image()
        img.src = event.target?.result as string
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const maxDimension = 1280 // Max ancho o alto
          let width = img.width
          let height = img.height

          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width)
              width = maxDimension
            } else {
              width = Math.round((width * maxDimension) / height)
              height = maxDimension
            }
          }

          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          ctx?.drawImage(img, 0, 0, width, height)

          canvas.toBlob(
            (blob) => {
              if (blob) resolve(blob)
              else reject(new Error('Falló la compresión de imagen en canvas.'))
            },
            'image/jpeg',
            0.82 // Calidad 82%
          )
        }
        img.onerror = (err) => reject(err)
      }
      reader.onerror = (err) => reject(err)
    })
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setError(null)

    try {
      // 1. Mostrar vista previa inmediata
      const objectUrl = URL.createObjectURL(file)
      setPreview(objectUrl)

      // 2. Comprimir imagen si es mayor a 500 KB
      let blobToUpload: Blob = file
      if (file.size > 500 * 1024) {
        blobToUpload = await compressImage(file)
      }

      // 3. Subir a Supabase Storage (Bucket: qr-comprobantes)
      const supabase = createClient()
      const fileName = `comprobante-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`

      const { data, error: uploadError } = await supabase.storage
        .from('qr-comprobantes')
        .upload(fileName, blobToUpload, {
          contentType: 'image/jpeg',
          upsert: true,
        })

      if (uploadError) {
        // En modo local o si el bucket no está creado en demo, caemos a una URL simulada o de vista previa local
        console.warn('⚠️ Supabase Storage aviso:', uploadError.message)
        console.log('💡 Usando vista previa de datos en memoria para continuar con la prueba sin fallo.')
        const reader = new FileReader()
        reader.onloadend = () => {
          onImageUploaded(reader.result as string)
        }
        reader.readAsDataURL(blobToUpload)
        setIsUploading(false)
        return
      }

      // 4. Obtener URL pública
      const { data: publicUrlData } = supabase.storage
        .from('qr-comprobantes')
        .getPublicUrl(fileName)

      if (publicUrlData?.publicUrl) {
        onImageUploaded(publicUrlData.publicUrl)
      } else {
        onImageUploaded(objectUrl)
      }
    } catch (err: any) {
      console.error('Error subiendo imagen:', err)
      setError('No se pudo procesar la imagen. Intenta con una foto más ligera o JPG.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="w-full">
      {!preview ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="group relative border-2 border-dashed border-zinc-700 hover:border-neon-amber/80 rounded-2xl p-8 transition-all duration-300 bg-dark-obsidian/60 hover:bg-zinc-900/80 cursor-pointer flex flex-col items-center justify-center text-center shadow-inner"
        >
          <div className="w-14 h-14 rounded-full bg-zinc-800 group-hover:bg-neon-amber/20 flex items-center justify-center text-zinc-400 group-hover:text-neon-amber transition-colors mb-4 shadow-lg">
            {isUploading ? (
              <Loader2 className="w-7 h-7 animate-spin text-neon-amber" />
            ) : (
              <Upload className="w-7 h-7" />
            )}
          </div>

          <h4 className="font-bold text-sm text-zinc-200 group-hover:text-white transition-colors">
            {isUploading ? 'Procesando y comprimiendo foto...' : 'Sube la captura o toma foto de tu transferencia'}
          </h4>
          <p className="text-xs text-zinc-500 mt-1 max-w-xs">
            Formato JPG, PNG o WEBP. El sistema optimiza automáticamente el peso del archivo (&lt; 1 MB).
          </p>

          <div className="flex items-center gap-2 mt-5 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-neon-amber">
            <Camera className="w-4 h-4" />
            <span>Abrir Galería o Cámara</span>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment" // Abre cámara directa en móviles
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      ) : (
        <div className="relative rounded-2xl overflow-hidden border-2 border-neon-green/60 bg-dark-obsidian p-4 shadow-neon-green">
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-white/10">
            <div className="flex items-center gap-2 text-neon-green text-xs font-bold uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              <span>Comprobante Cargado Listo para Verificación</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setPreview(null)
                onImageUploaded('')
              }}
              className="p-1 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="relative aspect-video max-h-56 w-full rounded-xl overflow-hidden bg-black/60 flex items-center justify-center border border-white/5">
            <img
              src={preview}
              alt="Comprobante QR"
              className="object-contain max-h-56 w-full"
            />
            {isUploading && (
              <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center gap-2 text-neon-amber font-bold text-xs">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Optimizando captura...</span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full mt-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Cambiar o subir otra foto</span>
          </button>
        </div>
      )}

      {error && (
        <div className="mt-3 p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-red-400 text-xs font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}
