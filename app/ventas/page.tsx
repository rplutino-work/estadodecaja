'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { formatDateOnly } from '@/lib/dateUtils'

interface Venta {
  id: string
  monto: number
  fecha: string
  descripcion?: string
  cliente?: string
  cantidad?: number
  tipoHongo: {
    id: string
    nombre: string
  }
  registradoPor: string
}

export default function VentasPage() {
  const router = useRouter()
  const [ventas, setVentas] = useState<Venta[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchVentas()
  }, [])

  const fetchVentas = async () => {
    try {
      const res = await fetch('/api/ventas')
      const data = await res.json()
      setVentas(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta venta?')) return

    try {
      const res = await fetch(`/api/ventas/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        fetchVentas()
      } else {
        alert('Error al eliminar la venta')
      }
    } catch (error) {
      console.error(error)
      alert('Error al eliminar la venta')
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(amount)
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
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
            Ventas
          </h1>
          <Link
            href="/ventas/nueva"
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all"
          >
            <Plus className="w-5 h-5" />
            Nueva Venta
          </Link>
        </div>

        <div className="glass-effect rounded-2xl p-6 shadow-lg">
          {ventas.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No hay ventas registradas</p>
              <Link
                href="/ventas/nueva"
                className="inline-block px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all"
              >
                Crear primera venta
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="text-left py-3 px-4 text-gray-700 font-semibold">Fecha</th>
                    <th className="text-left py-3 px-4 text-gray-700 font-semibold">Tipo</th>
                    <th className="text-left py-3 px-4 text-gray-700 font-semibold">Cliente</th>
                    <th className="text-left py-3 px-4 text-gray-700 font-semibold">Cantidad</th>
                    <th className="text-right py-3 px-4 text-gray-700 font-semibold">Monto</th>
                    <th className="text-left py-3 px-4 text-gray-700 font-semibold">Registrado por</th>
                    <th className="text-center py-3 px-4 text-gray-700 font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {ventas.map((venta) => (
                    <tr key={venta.id} className="border-b border-gray-200 hover:bg-white/50">
                      <td className="py-3 px-4 text-gray-700">
                        {formatDateOnly(venta.fecha)}
                      </td>
                      <td className="py-3 px-4 text-gray-700">{venta.tipoHongo.nombre}</td>
                      <td className="py-3 px-4 text-gray-700">{venta.cliente || '-'}</td>
                      <td className="py-3 px-4 text-gray-700">{venta.cantidad || '-'}</td>
                      <td className="py-3 px-4 text-right font-semibold text-green-600">
                        {formatCurrency(venta.monto)}
                      </td>
                      <td className="py-3 px-4 text-gray-700">{venta.registradoPor}</td>
                      <td className="py-3 px-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => router.push(`/ventas/${venta.id}/editar`)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(venta.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

