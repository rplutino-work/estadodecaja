'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { Plus, Edit, Trash2, ArrowRightLeft } from 'lucide-react'
import { format } from 'date-fns'

interface Ajuste {
  id: string
  monto: number
  fecha: string
  descripcion?: string
  quienPaga: string
  quienRecibe: string
  registradoPor: string
}

export default function AjustesPage() {
  const router = useRouter()
  const [ajustes, setAjustes] = useState<Ajuste[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAjustes()
  }, [])

  const fetchAjustes = async () => {
    try {
      const res = await fetch('/api/ajustes')
      const data = await res.json()
      setAjustes(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este ajuste?')) return

    try {
      const res = await fetch(`/api/ajustes/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        fetchAjustes()
      } else {
        alert('Error al eliminar el ajuste')
      }
    } catch (error) {
      console.error(error)
      alert('Error al eliminar el ajuste')
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
            Ajustes / Transferencias
          </h1>
          <Link
            href="/ajustes/nuevo"
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-purple-700 transition-all"
          >
            <Plus className="w-5 h-5" />
            Nuevo Ajuste
          </Link>
        </div>

        <div className="glass-effect rounded-2xl p-6 shadow-lg">
          {ajustes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No hay ajustes registrados</p>
              <Link
                href="/ajustes/nuevo"
                className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-purple-700 transition-all"
              >
                Crear primer ajuste
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="text-left py-3 px-4 text-gray-700 font-semibold">Fecha</th>
                    <th className="text-left py-3 px-4 text-gray-700 font-semibold">Quien Paga</th>
                    <th className="text-center py-3 px-4 text-gray-700 font-semibold"></th>
                    <th className="text-left py-3 px-4 text-gray-700 font-semibold">Quien Recibe</th>
                    <th className="text-right py-3 px-4 text-gray-700 font-semibold">Monto</th>
                    <th className="text-left py-3 px-4 text-gray-700 font-semibold">Descripción</th>
                    <th className="text-left py-3 px-4 text-gray-700 font-semibold">Registrado por</th>
                    <th className="text-center py-3 px-4 text-gray-700 font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {ajustes.map((ajuste) => (
                    <tr key={ajuste.id} className="border-b border-gray-200 hover:bg-white/50">
                      <td className="py-3 px-4 text-gray-700">
                        {format(new Date(ajuste.fecha), 'dd/MM/yyyy')}
                      </td>
                      <td className="py-3 px-4 text-gray-700 font-semibold text-red-600">
                        {getNombreSocio(ajuste.quienPaga)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <ArrowRightLeft className="w-5 h-5 text-gray-400 mx-auto" />
                      </td>
                      <td className="py-3 px-4 text-gray-700 font-semibold text-green-600">
                        {getNombreSocio(ajuste.quienRecibe)}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-purple-600">
                        {formatCurrency(ajuste.monto)}
                      </td>
                      <td className="py-3 px-4 text-gray-700">{ajuste.descripcion || '-'}</td>
                      <td className="py-3 px-4 text-gray-700">{ajuste.registradoPor}</td>
                      <td className="py-3 px-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => router.push(`/ajustes/${ajuste.id}/editar`)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(ajuste.id)}
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

