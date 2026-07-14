import { createClient } from '@supabase/supabase-js'
import { env } from '@/lib/env'

/**
 * Cliente de administración con privilegios de Service Role para verificar pagos,
 * ejecutar transacciones de inventario y tareas contables seguras en el servidor.
 */
export function getAdminSupabaseClient() {
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  return createClient(env.NEXT_PUBLIC_SUPABASE_URL, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}
