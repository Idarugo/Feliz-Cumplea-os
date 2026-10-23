import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import confetti from 'canvas-confetti'

const DIGIT_SPACING = 40

export function CakeScene({
  age,
  prompt,
  done,
  onContinue,
}: {
  age: string
  prompt: string
  done: string
  onContinue: () => void
}) {
  const [blown, setBlown] = useState(false)
  const digits = age.split('')
  const startX = 120 - ((digits.length - 1) * DIGIT_SPACING) / 2
  const xs = digits.map((_, i) => startX + i * DIGIT_SPACING)

  const blow = () => {
    if (blown) return
    setBlown(true)
    window.setTimeout(() => {
      confetti({
        particleCount: 140,
        spread: 100,
        startVelocity: 42,
        origin: { x: 0.5, y: 0.55 },
        colors: ['#e8637a', '#dcb26b', '#f6c9cf', '#ffffff'],
      })
    }, 450)
  }

  return (
    <motion.div
      className="relative z-10 flex h-full flex-col items-center justify-center gap-6 px-6 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05, filter: 'blur(8px)' }}
      transition={{ duration: 0.5 }}
    >
      <div className="h-16">
        <AnimatePresence mode="wait">
          <motion.p
            key={blown ? 'done' : 'prompt'}
            className="font-display text-3xl text-blush-700"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
          >
            {blown ? done : prompt}
          </motion.p>
        </AnimatePresence>
      </div>

      <button
        type="button"
        onClick={blow}
        disabled={blown}
        aria-label="Soplar las velas"
        className="w-72 max-w-full"
      >
        <svg viewBox="0 0 240 230" className="w-full overflow-visible">
          <ellipse cx="120" cy="214" rx="104" ry="12" fill="var(--color-blush-200)" />
          <rect x="30" y="140" width="180" height="72" rx="14" fill="var(--color-blush-300)" />
          <rect x="55" y="95" width="130" height="50" rx="12" fill="var(--color-blush-100)" />
          <rect x="30" y="140" width="180" height="13" rx="6.5" fill="#fff6ee" stroke="var(--color-blush-200)" strokeWidth="1" />
          <rect x="55" y="95" width="130" height="13" rx="6.5" fill="#fff6ee" stroke="var(--color-blush-200)" strokeWidth="1" />
          {[52, 80, 108, 136, 164, 192].map((x, i) => (
            <circle key={x} cx={x} cy={i % 2 ? 156 : 153} r="5" fill="#fff6ee" />
          ))}
          {[48, 86, 124, 162, 196].map((x) => (
            <text key={x} x={x} y="190" fontSize="16" textAnchor="middle" fill="var(--color-blush-500)">
              ♥
            </text>
          ))}

          {digits.map((d, i) => (
            <text
              key={`d${i}`}
              x={xs[i]}
              y="97"
              textAnchor="middle"
              fontSize="66"
              fontWeight="700"
              fill="var(--color-gold-400)"
              stroke="var(--color-gold-500)"
              strokeWidth="1.5"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {d}
            </text>
          ))}

          <AnimatePresence>
            {!blown &&
              xs.map((x, i) => (
                <motion.g
                  key={`f${i}`}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  style={{ transformBox: 'fill-box', transformOrigin: '50% 100%' }}
                >
                  <motion.g
                    animate={{ scaleY: [1, 1.15, 0.92, 1.1, 1], rotate: [-3, 3, -2, 2, -3] }}
                    transition={{ duration: 1.2 + i * 0.25, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ transformBox: 'fill-box', transformOrigin: '50% 100%' }}
                  >
                    <circle cx={x} cy="33" r="15" fill="rgba(255,214,120,0.35)" />
                    <path
                      d={`M${x},17 C${x + 8},27 ${x + 8},38 ${x},42 C${x - 8},38 ${x - 8},27 ${x},17 Z`}
                      fill="#ff9d3d"
                    />
                    <path
                      d={`M${x},27 C${x + 4},32 ${x + 4},37 ${x},40 C${x - 4},37 ${x - 4},32 ${x},27 Z`}
                      fill="#ffe08a"
                    />
                  </motion.g>
                </motion.g>
              ))}
          </AnimatePresence>

          {blown &&
            xs.map((x, i) =>
              [0, 1, 2].map((k) => (
                <motion.circle
                  key={`s${i}-${k}`}
                  cx={x + (k - 1) * 5}
                  cy="40"
                  r={4 + k}
                  fill="#cdbcbc"
                  initial={{ opacity: 0.7, y: 0, scale: 0.6 }}
                  animate={{ opacity: 0, y: -45 - k * 12, scale: 2 }}
                  transition={{ duration: 1.7, delay: 0.12 * k, ease: 'easeOut' }}
                />
              )),
            )}
        </svg>
      </button>

      <div className="h-12">
        {blown ? (
          <motion.button
            type="button"
            onClick={onContinue}
            className="rounded-full bg-blush-500 px-8 py-3 font-sans text-sm font-semibold text-white shadow-lg shadow-blush-500/30"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            whileTap={{ scale: 0.95 }}
          >
            Continuar
          </motion.button>
        ) : (
          <p className="pt-3 text-xs tracking-wide text-blush-400 uppercase">
            Toca el pastel para soplar las velas
          </p>
        )}
      </div>
    </motion.div>
  )
}
