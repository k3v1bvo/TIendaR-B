import { NextResponse } from 'next/server'
import { getAdminSupabaseClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = getAdminSupabaseClient()
    const { data, error } = await supabase
      .from('configuracion_sitio')
      .select('*')
      .eq('id', 'config_principal')
      .single()

    if (error || !data) {
      return NextResponse.json({
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
      })
    }

    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({
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
    })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const supabase = getAdminSupabaseClient()

    const { error } = await supabase
      .from('configuracion_sitio')
      .upsert({
        id: 'config_principal',
        nombre_tienda: body.nombre_tienda || 'UpcyclingLab',
        subtitulo_tienda: body.subtitulo_tienda || 'Custom Shop & Rubber S.R.L.',
        logo_url: body.logo_url || '',
        tagline_hero: body.tagline_hero || 'REBELDÍA SOSTENIBLE & DISEÑO ÚNICO',
        descripcion_hero: body.descripcion_hero || '',
        imagen_hero_url: body.imagen_hero_url || 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?auto=format&fit=crop&w=1600&q=80',
        titulo_que_hacemos: body.titulo_que_hacemos || '¿A QUÉ NOS DEDICAMOS?',
        texto_que_hacemos: body.texto_que_hacemos || '',
        imagen_que_hacemos_url: body.imagen_que_hacemos_url || 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=80',
        instagram_url: body.instagram_url || '',
        tiktok_url: body.tiktok_url || '',
        whatsapp_number: body.whatsapp_number || '',
        updated_at: new Date().toISOString(),
      })

    if (error) {
      throw new Error(error.message)
    }

    return NextResponse.json({ success: true, message: 'Configuración actualizada con éxito' })
  } catch (error: any) {
    console.error('Error al guardar configuracion_sitio:', error)
    return NextResponse.json(
      { error: 'No se pudo actualizar la configuración en la base de datos', detalle: error.message },
      { status: 500 }
    )
  }
}
