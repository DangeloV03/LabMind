'use client'

import { motion } from 'framer-motion'
import Navigation from './components/Navigation'
import MolecularSimulation from './components/MolecularSimulation'
import ContactForm from './components/ContactForm'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
}

const glowVariants = {
  initial: { opacity: 0.5 },
  animate: {
    opacity: [0.5, 0.8, 0.5],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
}

export default function Home() {
  return (
    <main className="min-h-screen bg-black grid-background relative overflow-hidden">
      {/* Background molecular simulation */}
      <div className="fixed inset-0 z-0">
        <MolecularSimulation />
      </div>
      
      {/* Gradient overlays for depth */}
      <motion.div 
        variants={glowVariants}
        initial="initial"
        animate="animate"
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 30% 50%, rgba(50, 50, 80, 0.15) 0%, transparent 50%)'
        }}
      />
      <div 
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 70% 30%, rgba(80, 50, 50, 0.1) 0%, transparent 40%)'
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        <Navigation />
        
        <div className="pt-24 lg:pt-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24">
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="max-w-3xl space-y-10"
            >
              {/* Headline */}
              <motion.div variants={itemVariants} className="space-y-6">
                <h1 className="text-6xl sm:text-7xl lg:text-9xl font-extrabold text-white leading-[1.05] tracking-tight">
                  The Next Stage of
                  <br />
                  <span className="bg-gradient-to-r from-white via-gray-400 to-white bg-clip-text text-transparent">
                    Research Data
                  </span>
                  <br />
                  Analysis
                </h1>
              </motion.div>

              {/* Subheadline */}
              <motion.p 
                variants={itemVariants}
                className="text-2xl lg:text-3xl text-white/60 font-medium leading-relaxed tracking-wide"
              >
                AI-Powered Dynamic Pipelines for
                <br />
                [YOUR RESEARCH DOMAIN]
              </motion.p>

              {/* Product Description */}
              <motion.div
                variants={itemVariants}
                className="space-y-6 text-white/70 leading-relaxed"
              >
                <p className="text-xl lg:text-2xl">
                  LabMind transforms how researchers analyze data. Import your raw data in any format, 
                  answer dynamic AI-generated questions, and watch as our intelligent system builds 
                  a custom analysis pipeline tailored to your research needs.
                </p>
                <p className="text-xl lg:text-2xl">
                  From preprocessing to statistical analysis and visualization, each step is executed 
                  with precision. Review, refine, and iterate—all while maintaining complete control 
                  over your [SPECIFIC RESEARCH WORKFLOW].
                </p>
              </motion.div>

              {/* Feature highlights */}
              <motion.div 
                variants={itemVariants}
                className="flex flex-wrap gap-4 py-6"
              >
                {['Dynamic Pipelines', 'Any Data Format', 'AI-Guided Analysis'].map((feature, i) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + i * 0.1, duration: 0.5 }}
                    className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-full text-white/60 text-base font-medium tracking-wide"
                  >
                    {feature}
                  </motion.div>
                ))}
              </motion.div>

              {/* Contact Form */}
              <motion.div variants={itemVariants}>
                <ContactForm />
              </motion.div>
            </motion.div>
          </div>

          {/* Footer */}
          <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="border-t border-white/10 mt-24 relative z-10"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-white/40 text-sm">
                  © {new Date().getFullYear()} LabMind. [ADDITIONAL FOOTER TEXT]
                </p>
                <div className="flex items-center gap-6">
                  <motion.a 
                    href="#" 
                    whileHover={{ color: '#ffffff' }}
                    className="text-white/40 text-sm transition-colors"
                  >
                    [LINK 1]
                  </motion.a>
                  <motion.a 
                    href="#" 
                    whileHover={{ color: '#ffffff' }}
                    className="text-white/40 text-sm transition-colors"
                  >
                    [LINK 2]
                  </motion.a>
                </div>
              </div>
            </div>
          </motion.footer>
        </div>
      </div>
    </main>
  )
}
