'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { format } from 'date-fns'

interface Gasto {
  id: string
  monto: number
  fecha: string
  descripcion?: string
  proveedor?: string
  categoria: {
    id: string
    nombre: string
  }
  registradoPor: string
}

export default function GastosPage() {
  const router = useRouter()
  const [gastos, setGastos] = useState<Gasto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGastos()
  }, [])

  const fetchGastos = async () => {
    try {
      const res = await fetch('/api/gastos')
      const data = await res.json()
      setGastos(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este gasto?')) return

    try {
      const res = await fetch(`/api/gastos/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        fetchGastos()
      } else {
        alert('Error al eliminar el gasto')
      }
    } catch (error) {
      console.error(error)
      alert('Error al eliminar el gasto')
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
            Gastos
          </h1>
          <Link
            href="/gastos/nuevo"
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition-all"
          >
            <Plus className="w-5 h-5" />
            Nuevo Gasto
          </Link>
        </div>

        <div className="glass-effect rounded-2xl p-6 shadow-lg">
          {gastos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No hay gastos registrados</p>
              <Link
                href="/gastos/nuevo"
                className="inline-block px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition-all"
              >
                Crear primer gasto
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="text-left py-3 px-4 text-gray-700 font-semibold">Fecha</th>
                    <th className="text-left py-3 px-4 text-gray-700 font-semibold">Categoría</th>
                    <th className="text-left py-3 px-4 text-gray-700 font-semibold">Proveedor</th>
                    <th className="text-left py-3 px-4 text-gray-700 font-semibold">Descripción</th>
                    <th className="text-right py-3 px-4 text-gray-700 font-semibold">Monto</th>
                    <th className="text-left py-3 px-4 text-gray-700 font-semibold">Registrado por</th>
                    <th className="text-center py-3 px-4 text-gray-700 font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {gastos.map((gasto) => (
                    <tr key={gasto.id} className="border-b border-gray-200 hover:bg-white/50">
                      <td className="py-3 px-4 text-gray-700">
                        {format(new Date(gasto.fecha), 'dd/MM/yyyy')}
                      </td>
                      <td className="py-3 px-4 text-gray-700">{gasto.categoria.nombre}</td>
                      <td className="py-3 px-4 text-gray-700">{gasto.proveedor || '-'}</td>
                      <td className="py-3 px-4 text-gray-700">{gasto.descripcion || '-'}</td>
                      <td className="py-3 px-4 text-right font-semibold text-red-600">
                        {formatCurrency(gasto.monto)}
                      </td>
                      <td className="py-3 px-4 text-gray-700">{gasto.registradoPor}</td>
                      <td className="py-3 px-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => router.push(`/gastos/${gasto.id}/editar`)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(gasto.id)}
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

