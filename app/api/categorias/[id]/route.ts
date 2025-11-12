import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { nombre, descripcion } = body

    const categoria = await prisma.categoria.update({
      where: { id: params.id },
      data: {
        nombre,
        descripcion,
      },
    })

    return NextResponse.json(categoria)
  } catch (error) {
    console.error('Error updating categoria:', error)
    return NextResponse.json({ error: 'Error al actualizar categoría' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.categoria.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Categoría eliminada' })
  } catch (error) {
    console.error('Error deleting categoria:', error)
    return NextResponse.json({ error: 'Error al eliminar categoría' }, { status: 500 })
  }
}

