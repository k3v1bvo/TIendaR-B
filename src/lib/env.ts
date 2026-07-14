import { z } from 'zod'

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('NEXT_PUBLIC_SUPABASE_URL debe ser una URL válida').default('https://demo-project.supabase.co'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'NEXT_PUBLIC_SUPABASE_ANON_KEY es requerida').default('demo-anon-key'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  SMTP_HOST: z.string().default('smtp.gmail.com'),
  SMTP_PORT: z.coerce.number().default(465),
  SMTP_USER: z.string().default('test-upcycling@gmail.com'),
  SMTP_PASS: z.string().default('demo-pass'),
  NEXT_PUBLIC_CORPORATE_QR_URL: z.string().url().default('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80'),
  NEXT_PUBLIC_BANK_NAME: z.string().default('Banco Ganadero / BCP'),
  NEXT_PUBLIC_BANK_ACCOUNT: z.string().default('100-2345678-90'),
  NEXT_PUBLIC_BANK_HOLDER: z.string().default('UPCYCLING LAB S.R.L.'),
})

const parseResult = envSchema.safeParse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  NEXT_PUBLIC_CORPORATE_QR_URL: process.env.NEXT_PUBLIC_CORPORATE_QR_URL,
  NEXT_PUBLIC_BANK_NAME: process.env.NEXT_PUBLIC_BANK_NAME,
  NEXT_PUBLIC_BANK_ACCOUNT: process.env.NEXT_PUBLIC_BANK_ACCOUNT,
  NEXT_PUBLIC_BANK_HOLDER: process.env.NEXT_PUBLIC_BANK_HOLDER,
})

if (!parseResult.success) {
  console.warn('⚠️ Advertencia en variables de entorno:', parseResult.error.format())
}

export const env = parseResult.success
  ? parseResult.data
  : envSchema.parse({})
