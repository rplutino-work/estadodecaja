import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const tipos = await prisma.tipoHongo.findMany({
      orderBy: {
        nombre: 'asc',
      },
    })
    return NextResponse.json(tipos)
  } catch (error) {
    console.error('Error fetching tipos:', error)
    return NextResponse.json({ error: 'Error al obtener tipos de hongos' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nombre, descripcion } = body

    const tipo = await prisma.tipoHongo.create({
      data: {
        nombre,
        descripcion,
      },
    })

    return NextResponse.json(tipo, { status: 201 })
  } catch (error) {
    console.error('Error creating tipo:', error)
    return NextResponse.json({ error: 'Error al crear tipo de hongo' }, { status: 500 })
  }
}

