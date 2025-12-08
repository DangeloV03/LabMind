'use client'

import { useState, FormEvent } from 'react'
import { motion } from 'framer-motion'

export default function ContactForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      setStatus('error')
      setMessage('Please enter your email')
      return
    }

    if (!validateEmail(email)) {
      setStatus('error')
      setMessage('Please enter a valid email address')
      return
    }

    setStatus('loading')
    setMessage('')

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage('Thanks for joining! We\'ll notify you when we launch.')
        setEmail('')
      } else {
        setStatus('error')
        setMessage(data.error || 'Something went wrong. Please try again.')
      }
    } catch (error) {
      setStatus('error')
      setMessage('Something went wrong. Please try again.')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="w-full max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 px-5 py-4 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all text-white placeholder-white/40 text-lg"
            disabled={status === 'loading'}
          />
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.95)' }}
            whileTap={{ scale: 0.98 }}
            disabled={status === 'loading'}
            className="px-8 py-4 bg-white text-black rounded-lg font-semibold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? (
              <motion.span
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                ...
              </motion.span>
            ) : (
              'Join Waitlist'
            )}
          </motion.button>
        </div>
        
        {message && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-sm ${
              status === 'success' ? 'text-white/70' : 'text-red-400'
            }`}
          >
            {message}
          </motion.p>
        )}
        
        <p className="text-base text-white/40 mt-3">
          Join the waitlist to be notified when LabMind launches.
        </p>
      </form>
    </motion.div>
  )
}
