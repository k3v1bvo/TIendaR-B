import { NextResponse } from 'next/server'
import { getAdminSupabaseClient } from '@/lib/supabase/admin'
import { sendEmail } from '@/lib/mail/nodemailer'
import { getPedidoRecibidoTemplate } from '@/lib/mail/templates'
import { CartItem } from '@/components/shop/CartDrawer'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      cliente_nombre,
      correo,
      telefono,
      direccion_envio,
      notas_cliente,
      items,
      total,
      comprobante_url,
    } = body

    if (!cliente_nombre || !correo || !telefono || !direccion_envio || !items || !comprobante_url) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios para registrar el pedido y pago QR.' },
        { status: 400 }
      )
    }

    const supabase = getAdminSupabaseClient()

    // 1. Determinar el tipo_pedido principal en base a los ítems del carrito
    let tipoPedido = 'mixto'
    const hasRopaStock = items.some((i: CartItem) => i.tipo_item === 'prenda_stock')
    const hasRopaPropia = items.some((i: CartItem) => i.tipo_item === 'prenda_propia')
    const hasBilletera = items.some((i: CartItem) => i.tipo_item === 'billetera_caucho')

    if (hasBilletera && !hasRopaStock && !hasRopaPropia) tipoPedido = 'billetera'
    else if (hasRopaStock && !hasBilletera && !hasRopaPropia) tipoPedido = 'ropa_stock'
    else if (hasRopaPropia && !hasBilletera && !hasRopaStock) tipoPedido = 'ropa_propia'

    // 2. Insertar cabecera en la tabla pedidos
    const { data: pedidoData, error: pedidoError } = await supabase
      .from('pedidos')
      .insert({
        cliente_nombre,
        correo,
        telefono,
        direccion_envio,
        tipo_pedido: tipoPedido,
        tematica_prenda_propia: items.find((i: CartItem) => i.tematica_prenda_propia)?.tematica_prenda_propia || null,
        notas_cliente: notas_cliente || null,
        total: Number(total),
        estado: 'pendiente_pago',
      })
      .select('id, token_acceso')
      .single()

    let pedidoId = pedidoData?.id
    let tokenAcceso = pedidoData?.token_acceso

    // Si Supabase está en modo Demo/Desconectado, generamos IDs locales para no romper la experiencia en vivo
    if (pedidoError || !pedidoData) {
      console.warn('⚠️ Supabase DB Aviso (¿Modo Demo sin conectar?):', pedidoError?.message)
      pedidoId = `demo-${Date.now().toString(36)}`
      tokenAcceso = 'token-demo-' + Math.random().toString(36).slice(2, 10)
    } else {
      // 3. Insertar detalle de ítems (pedidos_items) y sus modificadores
      for (const item of items as CartItem[]) {
        const { data: itemData } = await supabase
          .from('pedidos_items')
          .insert({
            pedido_id: pedidoId,
            tipo_item: item.tipo_item,
            producto_base_id: item.producto_base_id || null,
            billetera_id: item.billetera_id || null,
            nombre_item: item.nombre_item,
            cantidad: item.cantidad,
            precio_unitario: item.precio_unitario,
            subtotal: item.precio_unitario * item.cantidad,
          })
          .select('id')
          .single()

        if (itemData?.id && item.modificadores_seleccionados) {
          for (const mod of item.modificadores_seleccionados) {
            await supabase.from('pedidos_items_modificadores').insert({
              pedido_item_id: itemData.id,
              modificador_id: mod.id,
              nombre_modificador: mod.nombre,
              precio_extra_congelado: mod.precio_extra,
            })
          }
        }
      }

      // 4. Registrar en la tabla pagos_qr en estado 'pendiente'
      await supabase.from('pagos_qr').insert({
        pedido_id: pedidoId,
        comprobante_url,
        monto_pagado: Number(total),
        estado_verificacion: 'pendiente',
      })
    }

    // 5. Enviar Correo Electrónico Automático (Evento 1: Pedido & Comprobante Recibidos)
    const resumenTexto = items
      .map((i: CartItem) => `• ${i.cantidad}x ${i.nombre_item} ($${(i.precio_unitario * i.cantidad).toFixed(2)})`)
      .join('<br/>')

    const htmlTemplate = getPedidoRecibidoTemplate({
      clienteNombre: cliente_nombre,
      pedidoId: pedidoId || 'ORDEN',
      tokenAcceso: tokenAcceso || 'demo',
      total: Number(total),
      tipoPedido,
      itemsResumen: resumenTexto,
    })

    // Disparamos el envío sin bloquear el retorno JSON si tarda el SMTP
    sendEmail({
      to: correo,
      subject: `⚡ Pedido Recibido y en Revisión - Orden #${String(pedidoId).slice(0, 8)}`,
      html: htmlTemplate,
    }).catch((e) => console.error('Error asíncrono enviando mail de confirmación:', e))

    return NextResponse.json({
      success: true,
      pedido_id: pedidoId,
      token_acceso: tokenAcceso,
      message: '¡Tu pedido fue registrado con éxito! El equipo auditará tu comprobante en breve.',
    })
  } catch (error: any) {
    console.error('Error fatal en /api/checkout:', error)
    return NextResponse.json(
      { error: 'Error del servidor procesando el checkout.' },
      { status: 500 }
    )
  }
}
