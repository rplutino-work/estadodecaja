import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const categorias = await prisma.categoria.findMany({
      orderBy: {
        nombre: 'asc',
      },
    })
    return NextResponse.json(categorias)
  } catch (error) {
    console.error('Error fetching categorias:', error)
    return NextResponse.json({ error: 'Error al obtener categorías' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nombre, descripcion } = body

    const categoria = await prisma.categoria.create({
      data: {
        nombre,
        descripcion,
      },
    })

    return NextResponse.json(categoria, { status: 201 })
  } catch (error) {
    console.error('Error creating categoria:', error)
    return NextResponse.json({ error: 'Error al crear categoría' }, { status: 500 })
  }
}

