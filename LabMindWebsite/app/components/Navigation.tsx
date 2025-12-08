'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 grid grid-cols-3 gap-0.5">
              {Array.from({ length: 9 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  className={`w-full h-full rounded-sm ${
                    i === 4 ? 'bg-transparent' : 'bg-white'
                  }`}
                />
              ))}
            </div>
            <span className="text-white font-semibold text-xl tracking-tight">labmind</span>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Menu icon */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Menu"
            >
              <div className="w-5 h-5 flex flex-col justify-center space-y-1.5">
                <motion.div 
                  animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 6 : 0 }}
                  className="w-full h-0.5 bg-white origin-center"
                />
                <motion.div 
                  animate={{ opacity: menuOpen ? 0 : 1 }}
                  className="w-full h-0.5 bg-white"
                />
                <motion.div 
                  animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -6 : 0 }}
                  className="w-full h-0.5 bg-white origin-center"
                />
              </div>
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
