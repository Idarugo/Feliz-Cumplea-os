import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Heart } from 'lucide-react'

const FILL_RATE = 42 // % per second while holding
const DECAY_RATE = 55 // % per second while released, before completion

export function HeartCharger({
  messages,
  onComplete,
}: {
  messages: string[]
  onComplete: () => void
}) {
  const [progress, setProgress] = useState(0)
  const [isHolding, setIsHolding] = useState(false)
  const rafRef = useRef<number | null>(null)
  const lastTsRef = useRef<number | null>(null)
  const doneRef = useRef(false)

  useEffect(() => {
    const tick = (ts: number) => {
      if (lastTsRef.current == null) lastTsRef.current = ts
      const dt = (ts - lastTsRef.current) / 1000
      lastTsRef.current = ts

      setProgress((prev) => {
        if (doneRef.current) return prev
        const rate = isHolding ? FILL_RATE : -DECAY_RATE
        const next = Math.min(100, Math.max(0, prev + rate * dt))
        if (next >= 100 && !doneRef.current) {
          doneRef.current = true
          window.setTimeout(onComplete, 550)
        }
        return next
      })

      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      lastTsRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHolding])

  const messageIndex = Math.min(
    messages.length - 1,
    Math.floor((progress / 100) * messages.length),
  )
  const isComplete = progress >= 100

  return (
    <motion.div
      className="relative z-10 flex h-full flex-col items-center justify-center gap-10 px-8 text-center select-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05, filter: 'blur(8px)' }}
      transition={{ duration: 0.5 }}
    >
      <div className="h-16">
        <AnimatePresence mode="wait">
          <motion.p
            key={isComplete ? 'complete' : messageIndex}
            className="font-serif text-2xl text-blush-700"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            {isComplete ? '¡Aquí está!' : messages[messageIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      <button
        type="button"
        aria-label="Mantén presionado para encender el corazón"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId)
          setIsHolding(true)
        }}
        onPointerUp={() => setIsHolding(false)}
        onPointerCancel={() => setIsHolding(false)}
        onPointerLeave={() => setIsHolding(false)}
        className="relative flex h-44 w-44 items-center justify-center rounded-full"
      >
        <svg viewBox="0 0 160 160" className="absolute inset-0 -rotate-90">
          <circle
            cx="80"
            cy="80"
            r="72"
            fill="none"
            stroke="var(--color-blush-100)"
            strokeWidth="6"
          />
          <motion.circle
            cx="80"
            cy="80"
            r="72"
            fill="none"
            stroke="var(--color-blush-400)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 72}
            animate={{ strokeDashoffset: 2 * Math.PI * 72 * (1 - progress / 100) }}
            transition={{ duration: 0.1, ease: 'linear' }}
          />
        </svg>

        <motion.div
          animate={{ scale: isHolding ? [1, 1.08, 1] : 1 }}
          transition={{ duration: 0.6, repeat: isHolding ? Infinity : 0 }}
          className="relative"
        >
          <Heart size={72} className="text-blush-200" fill="currentColor" />
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: `inset(${100 - progress}% 0 0 0)` }}
          >
            <Heart size={72} className="text-blush-500" fill="currentColor" />
          </div>
        </motion.div>

        <span className="absolute -bottom-9 font-sans text-sm font-medium tracking-wide text-blush-500">
          {Math.round(progress)}%
        </span>
      </button>

      <p className="max-w-[220px] font-sans text-xs tracking-wide text-blush-400 uppercase">
        Mantén presionado el corazón
      </p>
    </motion.div>
  )
}
