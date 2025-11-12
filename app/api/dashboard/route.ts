import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const [ventas, gastos] = await Promise.all([
      prisma.venta.findMany({
        include: {
          tipoHongo: true,
        },
      }),
      prisma.gasto.findMany({
        include: {
          categoria: true,
        },
      }),
    ])

    console.log(`Dashboard: ${ventas.length} ventas, ${gastos.length} gastos`)

    const totalVentas = ventas.reduce((sum, v) => sum + v.monto, 0)
    const totalGastos = gastos.reduce((sum, g) => sum + g.monto, 0)
    const balance = totalVentas - totalGastos
    const porSocio = balance / 2

    // Ventas por tipo de hongo
    const ventasPorTipo = ventas.reduce((acc, v) => {
      const tipo = v.tipoHongo.nombre
      acc[tipo] = (acc[tipo] || 0) + v.monto
      return acc
    }, {} as Record<string, number>)

    // Gastos por categoría
    const gastosPorCategoria = gastos.reduce((acc, g) => {
      const cat = g.categoria.nombre
      acc[cat] = (acc[cat] || 0) + g.monto
      return acc
    }, {} as Record<string, number>)

    // Ventas por registrador
    const ventasPorRegistrador = ventas.reduce((acc, v) => {
      acc[v.registradoPor] = (acc[v.registradoPor] || 0) + v.monto
      return acc
    }, {} as Record<string, number>)

    // Gastos por registrador
    const gastosPorRegistrador = gastos.reduce((acc, g) => {
      acc[g.registradoPor] = (acc[g.registradoPor] || 0) + g.monto
      return acc
    }, {} as Record<string, number>)

    return NextResponse.json({
      totalVentas,
      totalGastos,
      balance,
      porSocio,
      ventasPorTipo,
      gastosPorCategoria,
      ventasPorRegistrador,
      gastosPorRegistrador,
      totalVentasCount: ventas.length,
      totalGastosCount: gastos.length,
    })
  } catch (error) {
    console.error('Error fetching dashboard:', error)
    return NextResponse.json({ error: 'Error al obtener datos del dashboard' }, { status: 500 })
  }
}

