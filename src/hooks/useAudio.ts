import { useEffect, useRef, useState } from 'react'

/**
 * Controls a looping background track. Playback only starts after
 * `arm()` is called from within a user gesture (browsers block
 * autoplay otherwise) — call it from the first tap/click of the flow.
 */
export function useAudio(src: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isReady] = useState(() => Boolean(src))

  useEffect(() => {
    if (!src) return
    const audio = new Audio(src)
    audio.loop = true
    audio.volume = 0.45
    audioRef.current = audio
    return () => {
      audio.pause()
      audioRef.current = null
    }
  }, [src])

  const arm = () => {
    if (!audioRef.current) return
    audioRef.current
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false))
  }

  const toggle = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false))
    }
  }

  return { isPlaying, isReady, arm, toggle }
}
