'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import { TrendingUp, TrendingDown, ArrowRightLeft, Calendar } from 'lucide-react'
import { formatDateForDisplay } from '@/lib/dateUtils'

interface TimelineItem {
  id: string
  tipo: 'venta' | 'gasto' | 'ajuste'
  fecha: string
  monto: number
  descripcion: string
  registradoPor: string
  detalles: any
}

export default function TimelinePage() {
  const [timeline, setTimeline] = useState<TimelineItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTimeline()
    
    // Refrescar cuando la página recibe foco
    const handleFocus = () => {
      fetchTimeline()
    }
    
    // Refrescar cuando la página se vuelve visible
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchTimeline()
      }
    }
    
    window.addEventListener('focus', handleFocus)
    window.addEventListener('pageshow', handleFocus)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('pageshow', handleFocus)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  const fetchTimeline = async () => {
    try {
      // Agregar timestamp y hash aleatorio para evitar caché de Vercel
      const timestamp = new Date().getTime()
      const randomHash = Math.random().toString(36).substring(7)
      const res = await fetch(`/api/timeline?t=${timestamp}&_=${randomHash}`, {
        method: 'GET',
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0',
          'X-Vercel-Cache-Control': 'no-cache',
        },
      })
      const data = await res.json()
      setTimeline(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(amount)
  }

  const getNombreSocio = (socio: string) => {
    return socio === 'rodri' ? 'Rodri' : 'Juanchi'
  }

  const getIcon = (tipo: string) => {
    switch (tipo) {
      case 'venta':
        return <TrendingUp className="w-5 h-5 text-green-600" />
      case 'gasto':
        return <TrendingDown className="w-5 h-5 text-red-600" />
      case 'ajuste':
        return <ArrowRightLeft className="w-5 h-5 text-purple-600" />
      default:
        return null
    }
  }

  const getColor = (tipo: string) => {
    switch (tipo) {
      case 'venta':
        return 'border-l-green-500 bg-green-50'
      case 'gasto':
        return 'border-l-red-500 bg-red-50'
      case 'ajuste':
        return 'border-l-purple-500 bg-purple-50'
      default:
        return 'border-l-gray-500 bg-gray-50'
    }
  }

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

  return (
    <div className="min-h-screen gradient-mushroom">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
            Línea de Tiempo
          </h1>
          <button
            onClick={fetchTimeline}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors text-sm"
          >
            Actualizar
          </button>
        </div>

        <div className="glass-effect rounded-2xl p-6 shadow-lg">
          {timeline.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No hay transacciones registradas</p>
            </div>
          ) : (
            <div className="space-y-4">
              {timeline.map((item, index) => (
                <div
                  key={item.id}
                  className={`border-l-4 ${getColor(item.tipo)} rounded-r-lg p-4 hover:shadow-md transition-shadow`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="mt-1">{getIcon(item.tipo)}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-800 capitalize">{item.tipo}</span>
                          <span className="text-sm text-gray-500">
                            {formatDateForDisplay(item.fecha)}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-2">{item.descripcion}</p>
                        {item.tipo === 'venta' && (
                          <div className="text-sm text-gray-600 space-y-1">
                            {item.detalles.cliente && <p>Cliente: {item.detalles.cliente}</p>}
                            {item.detalles.cantidad && <p>Cantidad: {item.detalles.cantidad}</p>}
                            <p>Tipo: {item.detalles.tipoHongo}</p>
                          </div>
                        )}
                        {item.tipo === 'gasto' && (
                          <div className="text-sm text-gray-600 space-y-1">
                            {item.detalles.proveedor && <p>Proveedor: {item.detalles.proveedor}</p>}
                            <p>Categoría: {item.detalles.categoria}</p>
                          </div>
                        )}
                        {item.tipo === 'ajuste' && (
                          <div className="text-sm text-gray-600">
                            <p>
                              {getNombreSocio(item.detalles.quienPaga)} → {getNombreSocio(item.detalles.quienRecibe)}
                            </p>
                          </div>
                        )}
                        <p className="text-xs text-gray-500 mt-2">Registrado por: {item.registradoPor}</p>
                      </div>
                    </div>
                    <div className="ml-4">
                      <span
                        className={`text-xl font-bold ${
                          item.tipo === 'venta'
                            ? 'text-green-600'
                            : item.tipo === 'gasto'
                            ? 'text-red-600'
                            : 'text-purple-600'
                        }`}
                      >
                        {item.tipo === 'gasto' ? '-' : item.tipo === 'ajuste' ? '↔' : '+'}
                        {formatCurrency(item.monto)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

