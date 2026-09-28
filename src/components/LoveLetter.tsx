import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const CHARS_PER_SECOND = 38

export function LoveLetter({
  title,
  paragraphs,
  signature,
  onContinue,
}: {
  title: string
  paragraphs: string[]
  signature: string
  onContinue: () => void
}) {
  const fullText = paragraphs.join('\n\n')
  const [shown, setShown] = useState(0)
  const doneTyping = shown >= fullText.length
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    let last: number | null = null
    let acc = 0
    const tick = (ts: number) => {
      if (last == null) last = ts
      const dt = (ts - last) / 1000
      last = ts
      acc += dt * CHARS_PER_SECOND
      if (acc >= 1) {
        setShown((s) => Math.min(fullText.length, s + Math.floor(acc)))
        acc %= 1
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullText.length])

  const visible = fullText.slice(0, shown).split('\n\n')

  return (
    <motion.div
      className="relative z-10 flex h-full flex-col items-center justify-center gap-6 px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05, filter: 'blur(8px)' }}
      transition={{ duration: 0.5 }}
      onClick={() => !doneTyping && setShown(fullText.length)}
    >
      <motion.h2
        className="font-display text-3xl text-blush-700"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {title}
      </motion.h2>

      <div className="max-h-[46vh] max-w-md overflow-y-auto text-left">
        {visible.map((para, i) => (
          <p key={i} className="mb-4 font-serif text-xl leading-relaxed text-blush-700">
            {para}
            {!doneTyping && i === visible.length - 1 && (
              <span className="ml-0.5 inline-block w-[2px] animate-pulse bg-blush-500 align-middle">
                &nbsp;
              </span>
            )}
          </p>
        ))}
      </div>

      {doneTyping && (
        <motion.div
          className="flex flex-col items-center gap-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="font-serif text-lg text-blush-500 italic">{signature}</p>
          <button
            type="button"
            onClick={onContinue}
            className="rounded-full bg-blush-500 px-8 py-3 font-sans text-sm font-semibold text-white shadow-lg shadow-blush-500/30"
          >
            Continuar
          </button>
        </motion.div>
      )}

      {!doneTyping && (
        <p className="text-xs tracking-wide text-blush-400 uppercase">Toca para saltar</p>
      )}
    </motion.div>
  )
}
