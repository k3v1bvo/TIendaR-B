import nodemailer from 'nodemailer'
import { env } from '@/lib/env'

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465, // true para 465, false para otros puertos
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
})

interface SendMailParams {
  to: string
  subject: string
  html: string
}

/**
 * Envía un correo electrónico de forma resiliente. Si falla (por ejemplo en modo local sin credenciales),
 * registra la advertencia en consola pero no interrumpe el flujo transaccional del cliente.
 */
export async function sendEmail({ to, subject, html }: SendMailParams): Promise<boolean> {
  try {
    const info = await transporter.sendMail({
      from: `"UPCYCLING LAB & CUSTOM SHOP" <${env.SMTP_USER}>`,
      to,
      subject,
      html,
    })
    console.log(`✉️ [Mail Enviado]: ${info.messageId} a ${to}`)
    return true
  } catch (error: any) {
    console.warn(`⚠️ [Mail Fail-Safe]: No se pudo enviar el correo a ${to}. Razón:`, error.message)
    return false
  }
}
