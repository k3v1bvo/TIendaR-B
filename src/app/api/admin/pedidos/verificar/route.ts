import { NextResponse } from 'next/server'
import { getAdminSupabaseClient } from '@/lib/supabase/admin'
import { sendEmail } from '@/lib/mail/nodemailer'
import { getPagoVerificadoTemplate } from '@/lib/mail/templates'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { pago_id, pedido_id, notas, verificado_por } = body

    if (!pago_id || !pedido_id) {
      return NextResponse.json(
        { error: 'Faltan parámetros identificadores del pago y pedido para la verificación.' },
        { status: 400 }
      )
    }

    const supabase = getAdminSupabaseClient()

    // 1. Obtener la información completa de pedido para restar stock o armar correo
    const { data: pedido, error: fetchError } = await supabase
      .from('pedidos')
      .select(`
        *,
        pedidos_items (*)
      `)
      .eq('id', pedido_id)
      .single()

    // 2. Ejecutar actualización en pagos_qr y pedidos (o vía RPC si está conectada)
    const { error: rpcError } = await supabase.rpc('verificar_pago_y_restar_stock', {
      p_pago_id: pago_id,
      p_admin_id: verificado_por || null,
      p_notas: notas || 'Auditoría manual exitosa.',
    })

    if (rpcError) {
      console.warn('⚠️ Falló RPC directo (¿o estamos en modo local sin la función en DB?):', rpcError.message)
      // Fallback manual seguro del servidor si la función RPC aún no fue ejecutada por migration
      await supabase
        .from('pagos_qr')
        .update({
          estado_verificacion: 'verificado',
          verificado_por: verificado_por || null,
          verificado_en: new Date().toISOString(),
          notas_revision: notas || 'Verificado manualmente desde dashboard',
        })
        .eq('id', pago_id)

      await supabase
        .from('pedidos')
        .update({ estado: 'en_proceso' })
        .eq('id', pedido_id)
    }

    // 3. Disparar Correo Electrónico Automático (Evento 2: Pago Aprobado & En Producción)
    if (pedido?.correo) {
      const resumenTexto = (pedido.pedidos_items || [])
        .map((i: any) => `• ${i.cantidad}x ${i.nombre_item} ($${Number(i.subtotal).toFixed(2)})`)
        .join('<br/>') || 'Artículos de Upcycling Lab & Custom Shop'

      const htmlTemplate = getPagoVerificadoTemplate({
        clienteNombre: pedido.cliente_nombre,
        pedidoId: pedido.id,
        tokenAcceso: pedido.token_acceso || 'demo',
        total: Number(pedido.total),
        tipoPedido: pedido.tipo_pedido,
        itemsResumen: resumenTexto,
      })

      sendEmail({
        to: pedido.correo,
        subject: `✅ PAGO APROBADO & EN PRODUCCIÓN - Orden #${String(pedido.id).slice(0, 8)}`,
        html: htmlTemplate,
      }).catch((e) => console.error('Error enviando mail de verificación aprobada:', e))
    }

    return NextResponse.json({
      success: true,
      message: 'El pago ha sido audito y verificado con éxito. El pedido pasó a producción y se notificó al cliente.',
    })
  } catch (error: any) {
    console.error('Error al verificar pago en API admin:', error)
    return NextResponse.json(
      { error: 'Error interno verificando el pago QR.' },
      { status: 500 }
    )
  }
}
