import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const ajustes = await prisma.ajuste.findMany({
      orderBy: {
        fecha: 'desc',
      },
    })
    return NextResponse.json(ajustes)
  } catch (error) {
    console.error('Error fetching ajustes:', error)
    return NextResponse.json({ error: 'Error al obtener ajustes' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { monto, fecha, descripcion, quienPaga, quienRecibe, registradoPor } = body

    console.log('Creando ajuste:', { monto, fecha, quienPaga, quienRecibe, registradoPor })

    const ajuste = await prisma.ajuste.create({
      data: {
        monto: parseFloat(monto),
        fecha: new Date(fecha),
        descripcion,
        quienPaga,
        quienRecibe,
        registradoPor,
      },
    })

    console.log('Ajuste creado exitosamente:', ajuste.id)

    return NextResponse.json(ajuste, { status: 201 })
  } catch (error) {
    console.error('Error creating ajuste:', error)
    return NextResponse.json({ error: 'Error al crear ajuste' }, { status: 500 })
  }
}

