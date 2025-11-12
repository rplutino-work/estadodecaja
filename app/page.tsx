import Link from 'next/link'
import { TrendingUp, TrendingDown, Settings, BarChart3 } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen gradient-mushroom">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-primary-600 via-accent-600 to-mushroom-600 bg-clip-text text-transparent">
            🍄 Estado de Caja
          </h1>
          <p className="text-xl text-gray-700">Gestión de ventas y gastos</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link href="/ventas/nueva" className="group">
            <div className="glass-effect rounded-2xl p-6 hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-xl">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full mb-4 mx-auto group-hover:animate-float">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-center text-gray-800 mb-2">Nueva Venta</h3>
              <p className="text-sm text-gray-600 text-center">Registrar una nueva venta</p>
            </div>
          </Link>

          <Link href="/gastos/nuevo" className="group">
            <div className="glass-effect rounded-2xl p-6 hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-xl">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-full mb-4 mx-auto group-hover:animate-float">
                <TrendingDown className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-center text-gray-800 mb-2">Nuevo Gasto</h3>
              <p className="text-sm text-gray-600 text-center">Registrar un nuevo gasto</p>
            </div>
          </Link>

          <Link href="/dashboard" className="group">
            <div className="glass-effect rounded-2xl p-6 hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-xl">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mb-4 mx-auto group-hover:animate-float">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-center text-gray-800 mb-2">Dashboard</h3>
              <p className="text-sm text-gray-600 text-center">Ver estadísticas y resúmenes</p>
            </div>
          </Link>

          <Link href="/configuracion" className="group">
            <div className="glass-effect rounded-2xl p-6 hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-xl">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full mb-4 mx-auto group-hover:animate-float">
                <Settings className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-center text-gray-800 mb-2">Configuración</h3>
              <p className="text-sm text-gray-600 text-center">Gestionar categorías y tipos</p>
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/ventas" className="group">
            <div className="glass-effect rounded-2xl p-6 hover:scale-105 transition-transform duration-300 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Ver Ventas</h3>
              <p className="text-gray-600">Historial completo de ventas</p>
            </div>
          </Link>

          <Link href="/gastos" className="group">
            <div className="glass-effect rounded-2xl p-6 hover:scale-105 transition-transform duration-300 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Ver Gastos</h3>
              <p className="text-gray-600">Historial completo de gastos</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

