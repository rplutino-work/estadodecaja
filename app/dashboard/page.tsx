'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import { TrendingUp, TrendingDown, DollarSign, Users } from 'lucide-react'

interface BalanceSocio {
  ventas: number
  gastos: number
  balance: number
  ventasCobradas: number
  gastosPagados: number
  ajustesPagados: number
  ajustesRecibidos: number
  ajustesNetos: number
}

interface DashboardData {
  totalVentas: number
  totalGastos: number
  balance: number
  porSocio: number
  ventasPorTipo: Record<string, number>
  gastosPorCategoria: Record<string, number>
  ventasPorRegistrador: Record<string, number>
  gastosPorRegistrador: Record<string, number>
  balancePorSocio: Record<string, BalanceSocio>
  totalVentasCount: number
  totalGastosCount: number
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboard = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch('/api/dashboard', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      })
      
      if (!res.ok) {
        const errorText = await res.text()
        console.error('Dashboard API error:', res.status, errorText)
        throw new Error(`Error al obtener datos del dashboard (${res.status})`)
      }
      
      const data = await res.json()
      console.log('Dashboard data received:', data)
      
      // Validar que tenga balancePorSocio
      if (!data.balancePorSocio) {
        console.warn('balancePorSocio missing, initializing...')
        data.balancePorSocio = {
          rodri: { ventas: 0, gastos: 0, balance: 0, ventasCobradas: 0, gastosPagados: 0 },
          juanchi: { ventas: 0, gastos: 0, balance: 0, ventasCobradas: 0, gastosPagados: 0 }
        }
      }
      
      setData(data)
    } catch (err) {
      console.error('Error fetching dashboard:', err)
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboard()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen gradient-mushroom">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Cargando...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen gradient-mushroom">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-red-600 mb-4">{error}</div>
          <div className="text-center">
            <button
              onClick={fetchDashboard}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen gradient-mushroom">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-red-600">Error al cargar datos</div>
        </div>
      </div>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(amount)
  }

  return (
    <div className="min-h-screen gradient-mushroom">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <button
            onClick={fetchDashboard}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors text-sm"
          >
            Actualizar
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="glass-effect rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Total Ventas</h3>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-green-600">{formatCurrency(data.totalVentas)}</p>
            <p className="text-sm text-gray-600 mt-2">{data.totalVentasCount} ventas</p>
          </div>

          <div className="glass-effect rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Total Gastos</h3>
              <TrendingDown className="w-8 h-8 text-red-500" />
            </div>
            <p className="text-3xl font-bold text-red-600">{formatCurrency(data.totalGastos)}</p>
            <p className="text-sm text-gray-600 mt-2">{data.totalGastosCount} gastos</p>
          </div>

          <div className="glass-effect rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Balance Total</h3>
              <DollarSign className="w-8 h-8 text-blue-500" />
            </div>
            <p className={`text-3xl font-bold ${data.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(data.balance)}
            </p>
          </div>

        </div>

        {/* Balance Individual por Socio */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {['rodri', 'juanchi'].map((socio) => {
            const balanceData = data.balancePorSocio[socio] || { 
              ventas: 0, 
              gastos: 0, 
              balance: 0, 
              ventasCobradas: 0, 
              gastosPagados: 0,
              ajustesPagados: 0,
              ajustesRecibidos: 0,
              ajustesNetos: 0
            }
            const nombreSocio = socio === 'rodri' ? 'Rodri' : 'Juanchi'
            const esPositivo = balanceData.balance >= 0
            
            return (
              <div key={socio} className="glass-effect rounded-2xl p-6 shadow-lg">
                <h3 className="text-2xl font-bold mb-4 text-gray-800">{nombreSocio}</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Derecho (50% ventas)</span>
                      <span className="font-semibold text-blue-600">{formatCurrency(balanceData.ventas)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Obligación (50% gastos)</span>
                      <span className="font-semibold text-blue-600">{formatCurrency(balanceData.gastos)}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-gray-700 font-medium">Ventas cobradas</span>
                    <span className="font-bold text-green-600">{formatCurrency(balanceData.ventasCobradas)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <span className="text-gray-700 font-medium">Gastos pagados</span>
                    <span className="font-bold text-red-600">{formatCurrency(balanceData.gastosPagados)}</span>
                  </div>

                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Ajustes pagados</span>
                      <span className="font-semibold text-red-600">-{formatCurrency(balanceData.ajustesPagados)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Ajustes recibidos</span>
                      <span className="font-semibold text-green-600">+{formatCurrency(balanceData.ajustesRecibidos)}</span>
                    </div>
                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-purple-200">
                      <span className="text-sm font-semibold text-gray-700">Neto ajustes</span>
                      <span className={`font-bold ${balanceData.ajustesNetos >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(balanceData.ajustesNetos)}
                      </span>
                    </div>
                  </div>
                  
                  <div className={`flex justify-between items-center p-4 rounded-lg border-2 ${
                    esPositivo 
                      ? 'bg-green-100 border-green-300' 
                      : 'bg-red-100 border-red-300'
                  }`}>
                    <span className="text-lg font-semibold text-gray-800">
                      {esPositivo ? 'A favor' : 'En contra'}
                    </span>
                    <span className={`text-2xl font-bold ${
                      esPositivo ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {formatCurrency(Math.abs(balanceData.balance))}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="glass-effect rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Ventas por Tipo de Hongo</h3>
            <div className="space-y-3">
              {Object.entries(data.ventasPorTipo).map(([tipo, monto]) => (
                <div key={tipo} className="flex justify-between items-center">
                  <span className="text-gray-700">{tipo}</span>
                  <span className="font-semibold text-green-600">{formatCurrency(monto)}</span>
                </div>
              ))}
              {Object.keys(data.ventasPorTipo).length === 0 && (
                <p className="text-gray-500 text-center py-4">No hay ventas registradas</p>
              )}
            </div>
          </div>

          <div className="glass-effect rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Gastos por Categoría</h3>
            <div className="space-y-3">
              {Object.entries(data.gastosPorCategoria).map(([categoria, monto]) => (
                <div key={categoria} className="flex justify-between items-center">
                  <span className="text-gray-700">{categoria}</span>
                  <span className="font-semibold text-red-600">{formatCurrency(monto)}</span>
                </div>
              ))}
              {Object.keys(data.gastosPorCategoria).length === 0 && (
                <p className="text-gray-500 text-center py-4">No hay gastos registrados</p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-effect rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Ventas por Registrador</h3>
            <div className="space-y-3">
              {Object.entries(data.ventasPorRegistrador).map(([registrador, monto]) => (
                <div key={registrador} className="flex justify-between items-center">
                  <span className="text-gray-700">{registrador}</span>
                  <span className="font-semibold text-green-600">{formatCurrency(monto)}</span>
                </div>
              ))}
              {Object.keys(data.ventasPorRegistrador).length === 0 && (
                <p className="text-gray-500 text-center py-4">No hay ventas registradas</p>
              )}
            </div>
          </div>

          <div className="glass-effect rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Gastos por Registrador</h3>
            <div className="space-y-3">
              {Object.entries(data.gastosPorRegistrador).map(([registrador, monto]) => (
                <div key={registrador} className="flex justify-between items-center">
                  <span className="text-gray-700">{registrador}</span>
                  <span className="font-semibold text-red-600">{formatCurrency(monto)}</span>
                </div>
              ))}
              {Object.keys(data.gastosPorRegistrador).length === 0 && (
                <p className="text-gray-500 text-center py-4">No hay gastos registrados</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

