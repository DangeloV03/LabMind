'use client'

import { motion } from 'framer-motion'
import Navigation from '../components/Navigation'
import MolecularSimulation from '../components/MolecularSimulation'
import AIDataAnalysis from '../components/AIDataAnalysis'

export default function AnalyzePage() {
  return (
    <main className="min-h-screen bg-black grid-background relative overflow-hidden">
      {/* Background molecular simulation */}
      <div className="fixed inset-0 z-0 opacity-30">
        <MolecularSimulation />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        <Navigation />
        
        <div className="pt-24 lg:pt-32 pb-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <AIDataAnalysis />
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  )
}

