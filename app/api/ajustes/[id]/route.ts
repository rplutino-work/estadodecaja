import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ajuste = await prisma.ajuste.findUnique({
      where: { id: params.id },
    })

    if (!ajuste) {
      return NextResponse.json({ error: 'Ajuste no encontrado' }, { status: 404 })
    }

    return NextResponse.json(ajuste)
  } catch (error) {
    console.error('Error fetching ajuste:', error)
    return NextResponse.json({ error: 'Error al obtener ajuste' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { monto, fecha, descripcion, quienPaga, quienRecibe, registradoPor } = body

    const ajuste = await prisma.ajuste.update({
      where: { id: params.id },
      data: {
        monto: parseFloat(monto),
        fecha: new Date(fecha),
        descripcion,
        quienPaga,
        quienRecibe,
        registradoPor,
      },
    })

    return NextResponse.json(ajuste)
  } catch (error) {
    console.error('Error updating ajuste:', error)
    return NextResponse.json({ error: 'Error al actualizar ajuste' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.ajuste.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Ajuste eliminado' })
  } catch (error) {
    console.error('Error deleting ajuste:', error)
    return NextResponse.json({ error: 'Error al eliminar ajuste' }, { status: 500 })
  }
}

