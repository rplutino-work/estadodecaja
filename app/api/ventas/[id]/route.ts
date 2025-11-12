import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const venta = await prisma.venta.findUnique({
      where: { id: params.id },
      include: {
        tipoHongo: true,
      },
    })

    if (!venta) {
      return NextResponse.json({ error: 'Venta no encontrada' }, { status: 404 })
    }

    return NextResponse.json(venta)
  } catch (error) {
    console.error('Error fetching venta:', error)
    return NextResponse.json({ error: 'Error al obtener venta' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { monto, fecha, descripcion, cliente, cantidad, tipoHongoId, registradoPor } = body

    const venta = await prisma.venta.update({
      where: { id: params.id },
      data: {
        monto: parseFloat(monto),
        fecha: new Date(fecha),
        descripcion,
        cliente,
        cantidad: cantidad ? parseInt(cantidad) : null,
        tipoHongoId,
        registradoPor,
      },
      include: {
        tipoHongo: true,
      },
    })

    return NextResponse.json(venta)
  } catch (error) {
    console.error('Error updating venta:', error)
    return NextResponse.json({ error: 'Error al actualizar venta' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.venta.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Venta eliminada' })
  } catch (error) {
    console.error('Error deleting venta:', error)
    return NextResponse.json({ error: 'Error al eliminar venta' }, { status: 500 })
  }
}

