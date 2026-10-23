import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { content } from './content'
import { useAudio } from './hooks/useAudio'
import { FloatingHearts } from './components/FloatingHearts'
import { MusicToggle } from './components/MusicToggle'
import { CoverScene } from './components/CoverScene'
import { HeartCharger } from './components/HeartCharger'
import { PolaroidStack } from './components/PolaroidStack'
import { LoveLetter } from './components/LoveLetter'
import { CakeScene } from './components/CakeScene'
import { FinalToast } from './components/FinalToast'

type Scene = 'cover' | 'charge' | 'photos' | 'letter' | 'wish' | 'final'

function App() {
  const [scene, setScene] = useState<Scene>('cover')
  const audio = useAudio(content.musicSrc)

  useEffect(() => {
    document.title = `Feliz cumpleaños, ${content.recipientName}`
  }, [])

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-blush-50 via-white to-blush-100">
      <FloatingHearts />
      {content.musicSrc && <MusicToggle isPlaying={audio.isPlaying} onToggle={audio.toggle} />}

      <div className="relative mx-auto h-screen max-w-md">
        <AnimatePresence mode="wait">
          {scene === 'cover' && (
            <CoverScene
              key="cover"
              title={content.coverTitle}
              subtitle={content.coverSubtitle}
              date={content.eventDate}
              onStart={() => {
                audio.arm()
                setScene('charge')
              }}
            />
          )}

          {scene === 'charge' && (
            <HeartCharger
              key="charge"
              messages={content.chargeMessages}
              onComplete={() => setScene('photos')}
            />
          )}

          {scene === 'photos' && (
            <PolaroidStack
              key="photos"
              photos={content.photos}
              onFinish={() => setScene('letter')}
            />
          )}

          {scene === 'letter' && (
            <LoveLetter
              key="letter"
              title={content.letterTitle}
              paragraphs={content.letterParagraphs}
              signature={content.letterSignature}
              onContinue={() => setScene('wish')}
            />
          )}

          {scene === 'wish' && (
            <CakeScene
              key="wish"
              age={content.age}
              prompt={content.wishPrompt}
              done={content.wishDone}
              onContinue={() => setScene('final')}
            />
          )}

          {scene === 'final' && (
            <FinalToast
              key="final"
              title={content.finalTitle}
              message={content.finalMessage}
              photo={content.finalPhoto}
              recipientName={content.recipientName}
              onReplay={() => setScene('cover')}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default App
