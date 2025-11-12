'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, TrendingUp, TrendingDown, BarChart3, Settings, ArrowRightLeft, Clock, Menu, X } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const menuItems = [
    { href: '/', icon: Home, label: 'Inicio' },
    { href: '/ventas', icon: TrendingUp, label: 'Ventas' },
    { href: '/gastos', icon: TrendingDown, label: 'Gastos' },
    { href: '/dashboard', icon: BarChart3, label: 'Dashboard' },
    { href: '/ajustes', icon: ArrowRightLeft, label: 'Ajustes' },
    { href: '/timeline', icon: Clock, label: 'Timeline' },
    { href: '/configuracion', icon: Settings, label: 'Configuración' },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <nav className="glass-effect sticky top-0 z-50 mb-6">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link 
            href="/" 
            className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent"
            onClick={() => setIsOpen(false)}
          >
            🍄 Estado de Caja
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex gap-4">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`p-2 rounded-lg hover:bg-white/50 transition-colors ${
                    isActive(item.href) ? 'bg-white/30' : ''
                  }`}
                  title={item.label}
                >
                  <Icon className="w-5 h-5" />
                </Link>
              )
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/50 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="flex flex-col gap-2 py-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/50 transition-colors ${
                    isActive(item.href) ? 'bg-white/30 font-semibold' : ''
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-gray-700">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}

