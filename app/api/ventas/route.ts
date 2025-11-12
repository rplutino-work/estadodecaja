import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const ventas = await prisma.venta.findMany({
      include: {
        tipoHongo: true,
      },
      orderBy: {
        fecha: 'desc',
      },
    })
    return NextResponse.json(ventas)
  } catch (error) {
    console.error('Error fetching ventas:', error)
    return NextResponse.json({ error: 'Error al obtener ventas' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { monto, fecha, descripcion, cliente, cantidad, tipoHongoId, registradoPor } = body

    const venta = await prisma.venta.create({
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

    return NextResponse.json(venta, { status: 201 })
  } catch (error) {
    console.error('Error creating venta:', error)
    return NextResponse.json({ error: 'Error al crear venta' }, { status: 500 })
  }
}

