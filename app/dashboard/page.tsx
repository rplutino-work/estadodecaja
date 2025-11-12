'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import { TrendingUp, TrendingDown, DollarSign, Users } from 'lucide-react'

interface DashboardData {
  totalVentas: number
  totalGastos: number
  balance: number
  porSocio: number
  ventasPorTipo: Record<string, number>
  gastosPorCategoria: Record<string, number>
  ventasPorRegistrador: Record<string, number>
  gastosPorRegistrador: Record<string, number>
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
      const res = await fetch('/api/dashboard')
      
      if (!res.ok) {
        throw new Error('Error al obtener datos del dashboard')
      }
      
      const data = await res.json()
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
    
    // Refrescar cada vez que la página se vuelve visible
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchDashboard()
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
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

          <div className="glass-effect rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Por Socio (50/50)</h3>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
            <p className={`text-3xl font-bold ${data.porSocio >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(data.porSocio)}
            </p>
          </div>
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

