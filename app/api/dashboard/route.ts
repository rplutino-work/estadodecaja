import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Forzar no caché en la respuesta
    const headers = new Headers()
    headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0')
    headers.set('Pragma', 'no-cache')
    headers.set('Expires', '0')
    headers.set('X-Content-Type-Options', 'nosniff')
    
    console.log('Dashboard API: Iniciando consulta...', new Date().toISOString())
    
    const [ventas, gastos, ajustes] = await Promise.all([
      prisma.venta.findMany({
        include: {
          tipoHongo: true,
        },
      }).catch(err => {
        console.error('Error fetching ventas:', err)
        return []
      }),
      prisma.gasto.findMany({
        include: {
          categoria: true,
        },
      }).catch(err => {
        console.error('Error fetching gastos:', err)
        return []
      }),
      prisma.ajuste.findMany().catch(err => {
        console.error('Error fetching ajustes:', err)
        return []
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

    // Balance individual por socio
    // Lógica: Cada socio tiene derecho al 50% de todas las ventas y debe el 50% de todos los gastos
    // Pero el que registra la venta la cobró (tiene ese dinero en efectivo)
    // Y el que registra el gasto lo pagó (gastó de su bolsillo)
    // 
    // Ejemplo: Si Rodri cobró $20,000:
    // - Rodri tiene $20,000 en efectivo
    // - Le corresponde $10,000 (50%)
    // - Juanchi le corresponde $10,000 (50%) pero no lo tiene en efectivo
    // - Balance Rodri = $20,000 (tiene) - $10,000 (le corresponde) = $10,000 a favor (debe darle a Juanchi)
    // - Balance Juanchi = $10,000 (le corresponde) - $0 (tiene) = $10,000 a favor (le deben)
    //
    // Balance = (Lo que le corresponde de ventas - Lo que le corresponde de gastos) - (Lo que tiene en efectivo)
    // Lo que tiene = (Lo que cobró - Lo que pagó)
    // Balance = (Su parte de ventas - Su parte de gastos) - (Lo que cobró - Lo que pagó)
    
    const balancePorSocio: Record<string, {
      ventas: number
      gastos: number
      balance: number
      ventasCobradas: number
      gastosPagados: number
      ajustesPagados: number
      ajustesRecibidos: number
      ajustesNetos: number
    }> = {}

    // Inicializar ambos socios
    const socios = ['rodri', 'juanchi']
    const mitadVentas = totalVentas / 2
    const mitadGastos = totalGastos / 2
    
    // Calcular ajustes por socio
    // Si un socio paga un ajuste, pierde ese dinero
    // Si un socio recibe un ajuste, gana ese dinero
    const ajustesPorSocio: Record<string, number> = {}
    socios.forEach(socio => {
      ajustesPorSocio[socio] = 0
    })
    
    ajustes.forEach(ajuste => {
      // Quien paga pierde el monto
      ajustesPorSocio[ajuste.quienPaga] = (ajustesPorSocio[ajuste.quienPaga] || 0) - ajuste.monto
      // Quien recibe gana el monto
      ajustesPorSocio[ajuste.quienRecibe] = (ajustesPorSocio[ajuste.quienRecibe] || 0) + ajuste.monto
    })
    
    socios.forEach(socio => {
      const ventasCobradas = ventasPorRegistrador[socio] || 0
      const gastosPagados = gastosPorRegistrador[socio] || 0
      const ajustesNetos = ajustesPorSocio[socio] || 0
      
      // Lo que le corresponde (derecho - obligación)
      const leCorresponde = mitadVentas - mitadGastos
      
      // Lo que tiene en efectivo (cobró - pagó + ajustes)
      // Los ajustes se suman porque si recibió ajustes tiene más, si pagó ajustes tiene menos
      const tieneEnEfectivo = ventasCobradas - gastosPagados + ajustesNetos
      
      // Balance = Lo que le corresponde - Lo que tiene
      // Si es positivo: le deben dinero (le corresponde más de lo que tiene)
      // Si es negativo: debe dinero (tiene más de lo que le corresponde)
      const balance = leCorresponde - tieneEnEfectivo
      
      const ajustesPagados = ajustes.filter(a => a.quienPaga === socio).reduce((sum, a) => sum + a.monto, 0)
      const ajustesRecibidos = ajustes.filter(a => a.quienRecibe === socio).reduce((sum, a) => sum + a.monto, 0)
      
      balancePorSocio[socio] = {
        ventas: mitadVentas,
        gastos: mitadGastos,
        balance: balance,
        ventasCobradas: ventasCobradas,
        gastosPagados: gastosPagados,
        ajustesPagados: ajustesPagados,
        ajustesRecibidos: ajustesRecibidos,
        ajustesNetos: ajustesNetos,
      }
    })

    const response = NextResponse.json({
      totalVentas,
      totalGastos,
      balance,
      porSocio,
      ventasPorTipo,
      gastosPorCategoria,
      ventasPorRegistrador,
      gastosPorRegistrador,
      balancePorSocio,
      ajustesPorSocio,
      totalVentasCount: ventas.length,
      totalGastosCount: gastos.length,
      totalAjustesCount: ajustes.length,
    })
    
    // Agregar headers de no-caché
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    return response
  } catch (error) {
    console.error('Error fetching dashboard:', error)
    return NextResponse.json({ error: 'Error al obtener datos del dashboard' }, { status: 500 })
  }
}

