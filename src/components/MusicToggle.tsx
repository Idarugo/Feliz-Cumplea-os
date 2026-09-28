import { motion } from 'framer-motion'
import { Music, VolumeX } from 'lucide-react'

export function MusicToggle({
  isPlaying,
  onToggle,
}: {
  isPlaying: boolean
  onToggle: () => void
}) {
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      aria-label={isPlaying ? 'Silenciar música' : 'Activar música'}
      className="fixed right-4 top-4 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-white/70 text-blush-600 shadow-lg shadow-blush-800/10 backdrop-blur-sm ring-1 ring-white/60"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ delay: 0.6 }}
    >
      {isPlaying ? <Music size={18} /> : <VolumeX size={18} />}
    </motion.button>
  )
}
