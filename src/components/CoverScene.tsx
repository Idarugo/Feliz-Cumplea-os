import { motion } from 'framer-motion'

export function CoverScene({
  title,
  subtitle,
  date,
  onStart,
}: {
  title: string
  subtitle: string
  date: string
  onStart: () => void
}) {
  return (
    <motion.div
      className="relative z-10 flex h-full flex-col items-center justify-center gap-6 px-8 text-center"
      exit={{ opacity: 0, scale: 1.05, filter: 'blur(8px)' }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    >
      <motion.span
        className="font-serif text-lg tracking-[0.3em] text-blush-500 uppercase"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {date}
      </motion.span>

      <motion.h1
        className="font-display text-5xl leading-tight text-blush-700 sm:text-6xl"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.6 }}
      >
        {title}
      </motion.h1>

      <motion.p
        className="max-w-xs font-serif text-xl text-blush-600"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
      >
        {subtitle}
      </motion.p>

      <motion.button
        type="button"
        onClick={onStart}
        className="mt-6 rounded-full bg-blush-500 px-8 py-3.5 font-sans text-sm font-semibold tracking-wide text-white shadow-lg shadow-blush-500/30"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.75 }}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.03 }}
      >
        Toca para comenzar
      </motion.button>

      {import.meta.env.DEV && (
        <a
          href="/editor"
          className="fixed bottom-4 left-1/2 -translate-x-1/2 text-xs tracking-wide text-blush-300 underline underline-offset-2"
        >
          Editar contenido
        </a>
      )}
    </motion.div>
  )
}
