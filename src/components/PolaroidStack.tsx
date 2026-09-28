import { useState } from 'react'
import { motion, type PanInfo } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Photo } from '../content'
import { PhotoImg } from './PhotoImg'

const SWIPE_THRESHOLD = 90

export function PolaroidStack({
  photos,
  onFinish,
}: {
  photos: Photo[]
  onFinish: () => void
}) {
  const [index, setIndex] = useState(0)
  const [exitX, setExitX] = useState(0)
  const isLast = index === photos.length - 1

  const advance = (dir: 1 | -1) => {
    setExitX(dir * 300)
    if (dir === 1 && isLast) {
      window.setTimeout(onFinish, 200)
      return
    }
    window.setTimeout(() => {
      setIndex((i) => Math.min(photos.length - 1, Math.max(0, i + dir)))
    }, 0)
  }

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -SWIPE_THRESHOLD) advance(1)
    else if (info.offset.x > SWIPE_THRESHOLD && index > 0) advance(-1)
  }

  return (
    <motion.div
      className="relative z-10 flex h-full flex-col items-center justify-center gap-8 px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05, filter: 'blur(8px)' }}
      transition={{ duration: 0.5 }}
    >
      <p className="font-serif text-xl text-blush-600">Algunos de nuestros recuerdos</p>

      <div className="relative h-[380px] w-[280px]">
        {photos.map((photo, i) => {
          const depth = i - index
          if (depth < 0 || depth > 2) return null
          const isTop = depth === 0

          return (
            <motion.div
              key={photo.src + i}
              className="absolute inset-0 flex flex-col rounded-lg bg-white p-3 pb-6 shadow-xl shadow-blush-800/15"
              style={{ touchAction: 'pan-y', zIndex: photos.length - depth }}
              initial={false}
              animate={{
                scale: 1 - depth * 0.05,
                y: depth * 14,
                rotate: isTop ? 0 : depth % 2 === 0 ? -4 : 4,
                opacity: 1,
              }}
              exit={{ x: exitX, opacity: 0, rotate: exitX > 0 ? 12 : -12 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              drag={isTop ? 'x' : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.7}
              onDragEnd={isTop ? handleDragEnd : undefined}
              whileDrag={{ cursor: 'grabbing' }}
            >
              <div className="relative flex-1 overflow-hidden rounded-sm bg-blush-100">
                <PhotoImg
                  src={photo.src}
                  alt={photo.caption}
                  index={i}
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="pt-3 text-center font-serif text-base text-blush-700">
                {photo.caption}
              </p>
            </motion.div>
          )
        })}
      </div>

      <div className="flex items-center gap-2">
        {photos.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? 'w-5 bg-blush-500' : 'w-1.5 bg-blush-200'
            }`}
          />
        ))}
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          aria-label="Foto anterior"
          disabled={index === 0}
          onClick={() => advance(-1)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-blush-500 shadow-md shadow-blush-800/10 disabled:opacity-30"
        >
          <ChevronLeft size={18} />
        </button>

        {isLast ? (
          <button
            type="button"
            onClick={onFinish}
            className="rounded-full bg-blush-500 px-6 py-2.5 font-sans text-sm font-semibold text-white shadow-lg shadow-blush-500/30"
          >
            Continuar
          </button>
        ) : (
          <button
            type="button"
            aria-label="Siguiente foto"
            onClick={() => advance(1)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-blush-500 shadow-md shadow-blush-800/10"
          >
            <ChevronRight size={18} />
          </button>
        )}
      </div>
    </motion.div>
  )
}
