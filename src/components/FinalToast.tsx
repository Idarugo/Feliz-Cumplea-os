import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { toPng } from 'html-to-image'
import { Download, RotateCcw } from 'lucide-react'
import type { Photo } from '../content'
import { PhotoImg } from './PhotoImg'

export function FinalToast({
  title,
  message,
  photo,
  recipientName,
  onReplay,
}: {
  title: string
  message: string
  photo: Photo
  recipientName: string
  onReplay: () => void
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const colors = ['#e8637a', '#dcb26b', '#f6c9cf']
    const burst = (originX: number) =>
      confetti({
        particleCount: 60,
        spread: 70,
        startVelocity: 38,
        origin: { x: originX, y: 0.6 },
        colors,
      })
    const t1 = window.setTimeout(() => burst(0.2), 100)
    const t2 = window.setTimeout(() => burst(0.8), 250)
    const t3 = window.setTimeout(() => burst(0.5), 400)
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
      window.clearTimeout(t3)
    }
  }, [])

  const handleSave = async () => {
    if (!cardRef.current || isSaving) return
    setIsSaving(true)
    try {
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 2, cacheBust: true })
      const link = document.createElement('a')
      link.download = `feliz-cumpleaños-${recipientName.toLowerCase()}.png`
      link.href = dataUrl
      link.click()
    } catch {
      // Export can fail on cross-origin images; the on-screen card still looks great.
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <motion.div
      className="relative z-10 flex h-full flex-col items-center justify-center gap-6 px-8 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        ref={cardRef}
        className="flex w-64 flex-col items-center gap-4 rounded-2xl bg-white p-6 shadow-2xl shadow-blush-800/20"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 20 }}
      >
        <span className="font-serif text-sm tracking-[0.2em] text-blush-400 uppercase">
          {title}
        </span>
        <div className="h-48 w-48 overflow-hidden rounded-xl">
          <PhotoImg
            src={photo.src}
            alt={photo.caption}
            index={2}
            className="h-full w-full object-cover"
          />
        </div>
        <p className="font-display text-lg text-blush-700">{message}</p>
      </motion.div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 rounded-full bg-blush-500 px-6 py-3 font-sans text-sm font-semibold text-white shadow-lg shadow-blush-500/30 disabled:opacity-60"
        >
          <Download size={16} />
          {isSaving ? 'Guardando...' : 'Guardar este momento'}
        </button>
        <button
          type="button"
          onClick={onReplay}
          aria-label="Volver a empezar"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-blush-500 shadow-md shadow-blush-800/10"
        >
          <RotateCcw size={16} />
        </button>
      </div>
    </motion.div>
  )
}
