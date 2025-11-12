'use client'

import { useState, useEffect, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'

interface TipoHongo {
  id: string
  nombre: string
  descripcion?: string
}

export default function NuevaVentaPage() {
  const router = useRouter()
  const [tipos, setTipos] = useState<TipoHongo[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    monto: '',
    fecha: new Date().toISOString().split('T')[0],
    descripcion: '',
    cliente: '',
    cantidad: '',
    tipoHongoId: '',
    registradoPor: '',
  })

  useEffect(() => {
    fetch('/api/tipos-hongos')
      .then(res => res.json())
      .then(data => setTipos(data))
      .catch(err => console.error(err))
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/ventas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push('/ventas')
      } else {
        alert('Error al crear la venta')
      }
    } catch (error) {
      console.error(error)
      alert('Error al crear la venta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen gradient-mushroom">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
          Nueva Venta
        </h1>

        <form onSubmit={handleSubmit} className="glass-effect rounded-2xl p-8 shadow-lg">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monto *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.monto}
                onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha *
              </label>
              <input
                type="date"
                required
                value={formData.fecha}
                onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Hongo *
              </label>
              <select
                required
                value={formData.tipoHongoId}
                onChange={(e) => setFormData({ ...formData, tipoHongoId: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Seleccionar tipo</option>
                {tipos.map((tipo) => (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cantidad
              </label>
              <input
                type="number"
                value={formData.cantidad}
                onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Cantidad de hongos"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cliente
              </label>
              <input
                type="text"
                value={formData.cliente}
                onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Nombre del cliente"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows={3}
                placeholder="Descripción adicional"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Registrado por *
              </label>
              <select
                required
                value={formData.registradoPor}
                onChange={(e) => setFormData({ ...formData, registradoPor: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Seleccionar</option>
                <option value="rodri">Rodri</option>
                <option value="juanchi">Juanchi</option>
              </select>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-6 py-3 bg-gray-300 text-gray-800 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50"
              >
                {loading ? 'Guardando...' : 'Guardar Venta'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

