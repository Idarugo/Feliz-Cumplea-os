import { motion } from 'framer-motion'
import { useMemo } from 'react'

type Particle = {
  id: number
  left: number
  size: number
  duration: number
  delay: number
  opacity: number
}

/** Ambient decorative hearts drifting upward. Purely visual, non-interactive. */
export function FloatingHearts({ count = 10 }: { count?: number }) {
  const particles = useMemo<Particle[]>(
    () =>
      Array.from({ length: count }, (_, id) => ({
        id,
        left: Math.random() * 100,
        size: 10 + Math.random() * 16,
        duration: 9 + Math.random() * 8,
        delay: Math.random() * 8,
        opacity: 0.15 + Math.random() * 0.25,
      })),
    [count],
  )

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute bottom-[-5%] text-blush-400"
          style={{ left: `${p.left}%`, fontSize: p.size, opacity: p.opacity }}
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: '-120vh', opacity: [0, p.opacity, p.opacity, 0], x: [0, 12, -12, 0] }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          ♥
        </motion.span>
      ))}
    </div>
  )
}
