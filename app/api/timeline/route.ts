import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    console.log('Timeline API: Iniciando consulta...')
    const [ventas, gastos, ajustes] = await Promise.all([
      prisma.venta.findMany({
        include: {
          tipoHongo: true,
        },
        orderBy: {
          fecha: 'desc',
        },
      }).catch(() => []),
      prisma.gasto.findMany({
        include: {
          categoria: true,
        },
        orderBy: {
          fecha: 'desc',
        },
      }).catch(() => []),
      prisma.ajuste.findMany({
        orderBy: {
          fecha: 'desc',
        },
      }).catch(() => []),
    ])

    // Combinar todos los eventos en una línea de tiempo
    const timeline = [
      ...ventas.map(v => ({
        id: v.id,
        tipo: 'venta' as const,
        fecha: v.fecha,
        monto: v.monto,
        descripcion: v.descripcion || `Venta de ${v.tipoHongo.nombre}`,
        registradoPor: v.registradoPor,
        detalles: {
          cliente: v.cliente,
          cantidad: v.cantidad,
          tipoHongo: v.tipoHongo.nombre,
        },
      })),
      ...gastos.map(g => ({
        id: g.id,
        tipo: 'gasto' as const,
        fecha: g.fecha,
        monto: g.monto,
        descripcion: g.descripcion || `Gasto en ${g.categoria.nombre}`,
        registradoPor: g.registradoPor,
        detalles: {
          proveedor: g.proveedor,
          categoria: g.categoria.nombre,
        },
      })),
      ...ajustes.map(a => ({
        id: a.id,
        tipo: 'ajuste' as const,
        fecha: a.fecha,
        monto: a.monto,
        descripcion: a.descripcion || `Ajuste de ${a.quienPaga} a ${a.quienRecibe}`,
        registradoPor: a.registradoPor,
        detalles: {
          quienPaga: a.quienPaga,
          quienRecibe: a.quienRecibe,
        },
      })),
    ].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())

    const response = NextResponse.json(timeline)
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    return response
  } catch (error) {
    console.error('Error fetching timeline:', error)
    return NextResponse.json({ error: 'Error al obtener línea de tiempo' }, { status: 500 })
  }
}

