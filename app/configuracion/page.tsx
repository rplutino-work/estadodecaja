'use client'

import { useState, useEffect, FormEvent } from 'react'
import Navbar from '@/components/Navbar'
import { Plus, Edit, Trash2, Tag, Package } from 'lucide-react'

interface Categoria {
  id: string
  nombre: string
  descripcion?: string
}

interface TipoHongo {
  id: string
  nombre: string
  descripcion?: string
}

export default function ConfiguracionPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [tipos, setTipos] = useState<TipoHongo[]>([])
  const [loading, setLoading] = useState(true)
  const [showCategoriaForm, setShowCategoriaForm] = useState(false)
  const [showTipoForm, setShowTipoForm] = useState(false)
  const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(null)
  const [editingTipo, setEditingTipo] = useState<TipoHongo | null>(null)
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [categoriasRes, tiposRes] = await Promise.all([
        fetch('/api/categorias'),
        fetch('/api/tipos-hongos'),
      ])
      const [categoriasData, tiposData] = await Promise.all([
        categoriasRes.json(),
        tiposRes.json(),
      ])
      setCategorias(categoriasData)
      setTipos(tiposData)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleCategoriaSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      const url = editingCategoria
        ? `/api/categorias/${editingCategoria.id}`
        : '/api/categorias'
      const method = editingCategoria ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        fetchData()
        setFormData({ nombre: '', descripcion: '' })
        setShowCategoriaForm(false)
        setEditingCategoria(null)
      } else {
        alert('Error al guardar la categoría')
      }
    } catch (error) {
      console.error(error)
      alert('Error al guardar la categoría')
    }
  }

  const handleTipoSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      const url = editingTipo
        ? `/api/tipos-hongos/${editingTipo.id}`
        : '/api/tipos-hongos'
      const method = editingTipo ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        fetchData()
        setFormData({ nombre: '', descripcion: '' })
        setShowTipoForm(false)
        setEditingTipo(null)
      } else {
        alert('Error al guardar el tipo de hongo')
      }
    } catch (error) {
      console.error(error)
      alert('Error al guardar el tipo de hongo')
    }
  }

  const handleDeleteCategoria = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta categoría?')) return

    try {
      const response = await fetch(`/api/categorias/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchData()
      } else {
        alert('Error al eliminar la categoría')
      }
    } catch (error) {
      console.error(error)
      alert('Error al eliminar la categoría')
    }
  }

  const handleDeleteTipo = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este tipo de hongo?')) return

    try {
      const response = await fetch(`/api/tipos-hongos/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchData()
      } else {
        alert('Error al eliminar el tipo de hongo')
      }
    } catch (error) {
      console.error(error)
      alert('Error al eliminar el tipo de hongo')
    }
  }

  const startEditCategoria = (cat: Categoria) => {
    setEditingCategoria(cat)
    setFormData({ nombre: cat.nombre, descripcion: cat.descripcion || '' })
    setShowCategoriaForm(true)
  }

  const startEditTipo = (tipo: TipoHongo) => {
    setEditingTipo(tipo)
    setFormData({ nombre: tipo.nombre, descripcion: tipo.descripcion || '' })
    setShowTipoForm(true)
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
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
          Configuración
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Categorías */}
          <div className="glass-effect rounded-2xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Tag className="w-6 h-6" />
                Categorías de Gastos
              </h2>
              <button
                onClick={() => {
                  setShowCategoriaForm(!showCategoriaForm)
                  setEditingCategoria(null)
                  setFormData({ nombre: '', descripcion: '' })
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all"
              >
                <Plus className="w-4 h-4" />
                Nueva
              </button>
            </div>

            {showCategoriaForm && (
              <form onSubmit={handleCategoriaSubmit} className="mb-6 p-4 bg-white/50 rounded-lg">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                      rows={2}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
                    >
                      {editingCategoria ? 'Actualizar' : 'Crear'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCategoriaForm(false)
                        setEditingCategoria(null)
                        setFormData({ nombre: '', descripcion: '' })
                      }}
                      className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </form>
            )}

            <div className="space-y-2">
              {categorias.map((cat) => (
                <div
                  key={cat.id}
                  className="flex justify-between items-center p-3 bg-white/50 rounded-lg hover:bg-white/70 transition-colors"
                >
                  <div>
                    <p className="font-semibold text-gray-800">{cat.nombre}</p>
                    {cat.descripcion && (
                      <p className="text-sm text-gray-600">{cat.descripcion}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEditCategoria(cat)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategoria(cat.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {categorias.length === 0 && (
                <p className="text-center text-gray-500 py-4">No hay categorías registradas</p>
              )}
            </div>
          </div>

          {/* Tipos de Hongos */}
          <div className="glass-effect rounded-2xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Package className="w-6 h-6" />
                Tipos de Hongos
              </h2>
              <button
                onClick={() => {
                  setShowTipoForm(!showTipoForm)
                  setEditingTipo(null)
                  setFormData({ nombre: '', descripcion: '' })
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-purple-700 transition-all"
              >
                <Plus className="w-4 h-4" />
                Nuevo
              </button>
            </div>

            {showTipoForm && (
              <form onSubmit={handleTipoSubmit} className="mb-6 p-4 bg-white/50 rounded-lg">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                      rows={2}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
                    >
                      {editingTipo ? 'Actualizar' : 'Crear'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowTipoForm(false)
                        setEditingTipo(null)
                        setFormData({ nombre: '', descripcion: '' })
                      }}
                      className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </form>
            )}

            <div className="space-y-2">
              {tipos.map((tipo) => (
                <div
                  key={tipo.id}
                  className="flex justify-between items-center p-3 bg-white/50 rounded-lg hover:bg-white/70 transition-colors"
                >
                  <div>
                    <p className="font-semibold text-gray-800">{tipo.nombre}</p>
                    {tipo.descripcion && (
                      <p className="text-sm text-gray-600">{tipo.descripcion}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEditTipo(tipo)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteTipo(tipo.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {tipos.length === 0 && (
                <p className="text-center text-gray-500 py-4">No hay tipos de hongos registrados</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

