/**
 * Plantillas HTML con estética Dark Matte & Neon para notificaciones automáticas de pedidos y pagos.
 */

interface PedidoEmailProps {
  clienteNombre: string
  pedidoId: string
  tokenAcceso: string
  total: number
  tipoPedido: string
  itemsResumen: string
}

export function getPedidoRecibidoTemplate({
  clienteNombre,
  pedidoId,
  tokenAcceso,
  total,
  tipoPedido,
  itemsResumen,
}: PedidoEmailProps): string {
  const trackingUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/pedido/${tokenAcceso}`

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <title>Pedido Recibido - Upcycling Lab</title>
      <style>
        body { background-color: #0A0A0C; color: #F5F5F7; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background-color: #131316; border: 1px solid #2A2A32; border-radius: 16px; overflow: hidden; box-shadow: 0 0 30px rgba(245, 158, 11, 0.15); }
        .header { background: linear-gradient(135deg, #1A1A1E 0%, #131316 100%); padding: 30px 20px; text-align: center; border-bottom: 2px solid #F59E0B; }
        .header h1 { color: #F59E0B; font-size: 24px; letter-spacing: 2px; text-transform: uppercase; margin: 0; }
        .content { padding: 30px 25px; }
        .badge { display: inline-block; background-color: rgba(245, 158, 11, 0.15); color: #F59E0B; padding: 6px 12px; border-radius: 9999px; font-weight: bold; font-size: 12px; text-transform: uppercase; border: 1px solid rgba(245, 158, 11, 0.3); }
        .box { background-color: #1A1A1E; border: 1px solid #2A2A32; border-radius: 12px; padding: 18px; margin: 20px 0; }
        .total { font-size: 22px; font-weight: 900; color: #10B981; }
        .btn { display: inline-block; background-color: #F59E0B; color: #000000 !important; font-weight: 900; text-transform: uppercase; text-decoration: none; padding: 14px 28px; border-radius: 10px; margin-top: 25px; letter-spacing: 1px; }
        .footer { background-color: #0A0A0C; padding: 20px; text-align: center; font-size: 12px; color: #71717A; border-top: 1px solid #2A2A32; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>⚡ UPCYCLING LAB & CUSTOM SHOP</h1>
          <p style="color: #A1A1AA; margin-top: 8px; font-size: 14px;">Laboratorio de Customización & Accesorios Sostenibles</p>
        </div>
        <div class="content">
          <p style="font-size: 18px;">¡Hola, <strong style="color: #FFF;">${clienteNombre}</strong>! 🔥</p>
          <p style="color: #D4D4D8; line-height: 1.6;">
            Hemos recibido correctamente tu pedido y tu comprobante de transferencia QR. Nuestro equipo se encuentra verificando el ingreso para dar inicio inmediato a la producción/despacho en el laboratorio.
          </p>
          
          <div style="margin: 20px 0;">
            <span class="badge">Estado: PAGO EN REVISIÓN</span>
          </div>

          <div class="box">
            <p style="margin: 0 0 10px 0; color: #A1A1AA; font-size: 12px; text-transform: uppercase;">Detalle de Orden (#${pedidoId.slice(0, 8)})</p>
            <p style="margin: 0 0 15px 0; font-size: 15px; color: #FFF; line-height: 1.5;">${itemsResumen}</p>
            <hr style="border: none; border-top: 1px solid #2A2A32; margin: 15px 0;" />
            <p style="margin: 0; display: flex; justify-content: space-between;">
              <span style="color: #A1A1AA;">Total a Pagar:</span>
              <strong class="total">$${total.toFixed(2)} USD</strong>
            </p>
          </div>

          <p style="color: #D4D4D8; font-size: 14px;">
            Puedes revisar en tiempo real si tu pago ha sido aprobado y el avance en el laboratorio desde tu portal privado:
          </p>
          <div style="text-align: center;">
            <a href="${trackingUrl}" class="btn">Seguir mi Pedido en Vivo →</a>
          </div>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} Upcycling Lab & Custom Shop. Todos los derechos reservados.<br />
          Hecho con rebeldía sostenible y estética Dark Matte & Neon.
        </div>
      </div>
    </body>
    </html>
  `
}

export function getPagoVerificadoTemplate({
  clienteNombre,
  pedidoId,
  tokenAcceso,
  total,
  itemsResumen,
}: PedidoEmailProps): string {
  const trackingUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/pedido/${tokenAcceso}`

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <title>Pago Aprobado - Upcycling Lab</title>
      <style>
        body { background-color: #0A0A0C; color: #F5F5F7; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background-color: #131316; border: 1px solid #2A2A32; border-radius: 16px; overflow: hidden; box-shadow: 0 0 30px rgba(16, 185, 129, 0.2); }
        .header { background: linear-gradient(135deg, #1A1A1E 0%, #131316 100%); padding: 30px 20px; text-align: center; border-bottom: 2px solid #10B981; }
        .header h1 { color: #10B981; font-size: 24px; letter-spacing: 2px; text-transform: uppercase; margin: 0; }
        .content { padding: 30px 25px; }
        .badge { display: inline-block; background-color: rgba(16, 185, 129, 0.15); color: #10B981; padding: 6px 12px; border-radius: 9999px; font-weight: bold; font-size: 12px; text-transform: uppercase; border: 1px solid rgba(16, 185, 129, 0.3); }
        .box { background-color: #1A1A1E; border: 1px solid #2A2A32; border-radius: 12px; padding: 18px; margin: 20px 0; }
        .total { font-size: 22px; font-weight: 900; color: #10B981; }
        .btn { display: inline-block; background-color: #10B981; color: #000000 !important; font-weight: 900; text-transform: uppercase; text-decoration: none; padding: 14px 28px; border-radius: 10px; margin-top: 25px; letter-spacing: 1px; }
        .footer { background-color: #0A0A0C; padding: 20px; text-align: center; font-size: 12px; color: #71717A; border-top: 1px solid #2A2A32; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ PAGO VERIFICADO & EN PRODUCCIÓN</h1>
          <p style="color: #A1A1AA; margin-top: 8px; font-size: 14px;">Tu pieza está oficialmente en manos del artista</p>
        </div>
        <div class="content">
          <p style="font-size: 18px;">¡Excelente noticia, <strong style="color: #FFF;">${clienteNombre}</strong>! 🎉</p>
          <p style="color: #D4D4D8; line-height: 1.6;">
            Nuestro equipo contable ha audito y <strong style="color: #10B981;">aprobado con éxito</strong> tu transferencia QR. El pedido ha pasado al estado de producción artesanal en el Laboratorio / preparación de envío.
          </p>
          
          <div style="margin: 20px 0;">
            <span class="badge">Estado: VERIFICADO & EN PRODUCCIÓN</span>
          </div>

          <div class="box">
            <p style="margin: 0 0 10px 0; color: #A1A1AA; font-size: 12px; text-transform: uppercase;">Orden Confirmada (#${pedidoId.slice(0, 8)})</p>
            <p style="margin: 0 0 15px 0; font-size: 15px; color: #FFF; line-height: 1.5;">${itemsResumen}</p>
            <hr style="border: none; border-top: 1px solid #2A2A32; margin: 15px 0;" />
            <p style="margin: 0; display: flex; justify-content: space-between;">
              <span style="color: #A1A1AA;">Monto Validado:</span>
              <strong class="total">$${total.toFixed(2)} USD</strong>
            </p>
          </div>

          <p style="color: #D4D4D8; font-size: 14px;">
            Mantén este enlace a la vista para conocer cuando tu paquete haya sido despachado con su número de guía:
          </p>
          <div style="text-align: center;">
            <a href="${trackingUrl}" class="btn">Ver Estatus en el Portal →</a>
          </div>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} Upcycling Lab & Custom Shop. Todos los derechos reservados.
        </div>
      </div>
    </body>
    </html>
  `
}
