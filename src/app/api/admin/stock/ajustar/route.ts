import { NextResponse } from 'next/server'
import { getAdminSupabaseClient } from '@/lib/supabase/admin'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { tabla, item_id, delta } = body

    if (!tabla || !item_id || typeof delta !== 'number') {
      return NextResponse.json(
        { error: 'Parámetros inválidos para ajustar existencias de inventario.' },
        { status: 400 }
      )
    }

    if (tabla !== 'billeteras_caucho' && tabla !== 'productos_base') {
      return NextResponse.json(
        { error: 'Tabla no permitida para ajuste de stock.' },
        { status: 400 }
      )
    }

    const supabase = getAdminSupabaseClient()
    const campoStock = tabla === 'billeteras_caucho' ? 'stock_disponible' : 'stock'
    const campoNombre = tabla === 'billeteras_caucho' ? 'nombre_diseno' : 'nombre'

    // 1. Consultar stock actual
    const { data: actual, error: fetchError } = await supabase
      .from(tabla)
      .select(`${campoStock}, ${campoNombre}`)
      .eq('id', item_id)
      .single()

    if (fetchError || !actual) {
      console.error(`Error al buscar ítem ${item_id} en tabla ${tabla}:`, fetchError?.message)
      return NextResponse.json(
        { error: 'No se encontró el ítem especificado en la base de datos o columna inexistente.', detalle: fetchError?.message },
        { status: 404 }
      )
    }

    const valorAnterior = (actual as any)[campoStock] ?? 0
    const nombreItem = (actual as any)[campoNombre] || 'Ítem'
    const nuevoValor = Math.max(0, valorAnterior + delta)

    // 2. Actualizar stock
    const { error: updateError } = await supabase
      .from(tabla)
      .update({ [campoStock]: nuevoValor })
      .eq('id', item_id)

    if (updateError) {
      throw new Error(updateError.message)
    }

    return NextResponse.json({
      success: true,
      anterior_stock: valorAnterior,
      nuevo_stock: nuevoValor,
      item: nombreItem,
    })
  } catch (error: any) {
    console.error('Error al ajustar stock:', error)
    return NextResponse.json(
      { error: 'Ocurrió un error en el servidor al intentar modificar el stock.' },
      { status: 500 }
    )
  }
}
