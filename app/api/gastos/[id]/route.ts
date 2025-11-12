import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const gasto = await prisma.gasto.findUnique({
      where: { id: params.id },
      include: {
        categoria: true,
      },
    })

    if (!gasto) {
      return NextResponse.json({ error: 'Gasto no encontrado' }, { status: 404 })
    }

    return NextResponse.json(gasto)
  } catch (error) {
    console.error('Error fetching gasto:', error)
    return NextResponse.json({ error: 'Error al obtener gasto' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { monto, fecha, descripcion, proveedor, categoriaId, registradoPor } = body

    const gasto = await prisma.gasto.update({
      where: { id: params.id },
      data: {
        monto: parseFloat(monto),
        fecha: new Date(fecha),
        descripcion,
        proveedor,
        categoriaId,
        registradoPor,
      },
      include: {
        categoria: true,
      },
    })

    return NextResponse.json(gasto)
  } catch (error) {
    console.error('Error updating gasto:', error)
    return NextResponse.json({ error: 'Error al actualizar gasto' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.gasto.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Gasto eliminado' })
  } catch (error) {
    console.error('Error deleting gasto:', error)
    return NextResponse.json({ error: 'Error al eliminar gasto' }, { status: 500 })
  }
}

