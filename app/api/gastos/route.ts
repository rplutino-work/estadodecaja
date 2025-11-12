import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const gastos = await prisma.gasto.findMany({
      include: {
        categoria: true,
      },
      orderBy: {
        fecha: 'desc',
      },
    })
    const response = NextResponse.json(gastos)
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate')
    return response
  } catch (error) {
    console.error('Error fetching gastos:', error)
    return NextResponse.json({ error: 'Error al obtener gastos' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { monto, fecha, descripcion, proveedor, categoriaId, registradoPor } = body

    const gasto = await prisma.gasto.create({
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

    return NextResponse.json(gasto, { status: 201 })
  } catch (error) {
    console.error('Error creating gasto:', error)
    return NextResponse.json({ error: 'Error al crear gasto' }, { status: 500 })
  }
}

