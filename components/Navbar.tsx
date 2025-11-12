import Link from 'next/link'
import { Home, TrendingUp, TrendingDown, BarChart3, Settings } from 'lucide-react'

export default function Navbar() {
  return (
    <nav className="glass-effect sticky top-0 z-50 mb-6">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
            🍄 Estado de Caja
          </Link>
          <div className="flex gap-4">
            <Link href="/" className="p-2 rounded-lg hover:bg-white/50 transition-colors">
              <Home className="w-5 h-5" />
            </Link>
            <Link href="/ventas" className="p-2 rounded-lg hover:bg-white/50 transition-colors">
              <TrendingUp className="w-5 h-5" />
            </Link>
            <Link href="/gastos" className="p-2 rounded-lg hover:bg-white/50 transition-colors">
              <TrendingDown className="w-5 h-5" />
            </Link>
            <Link href="/dashboard" className="p-2 rounded-lg hover:bg-white/50 transition-colors">
              <BarChart3 className="w-5 h-5" />
            </Link>
            <Link href="/configuracion" className="p-2 rounded-lg hover:bg-white/50 transition-colors">
              <Settings className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

