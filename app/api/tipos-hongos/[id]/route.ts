import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { nombre, descripcion } = body

    const tipo = await prisma.tipoHongo.update({
      where: { id: params.id },
      data: {
        nombre,
        descripcion,
      },
    })

    return NextResponse.json(tipo)
  } catch (error) {
    console.error('Error updating tipo:', error)
    return NextResponse.json({ error: 'Error al actualizar tipo de hongo' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.tipoHongo.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Tipo de hongo eliminado' })
  } catch (error) {
    console.error('Error deleting tipo:', error)
    return NextResponse.json({ error: 'Error al eliminar tipo de hongo' }, { status: 500 })
  }
}

