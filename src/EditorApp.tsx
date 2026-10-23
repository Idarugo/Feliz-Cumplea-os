import { useState, type ReactNode } from 'react'
import { Music2, Plus, Save, Trash2, ArrowUp, ArrowDown, ExternalLink, Upload } from 'lucide-react'
import { content as initialContent, type Content, type Photo } from './content'
import { PhotoImg } from './components/PhotoImg'

type SaveState = 'idle' | 'saving' | 'saved' | 'error'

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      resolve(result.slice(result.indexOf(',') + 1))
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

async function uploadFile(file: File, folder: 'photos' | 'audio'): Promise<string> {
  const dataBase64 = await fileToBase64(file)
  const res = await fetch('/api/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename: file.name, folder, dataBase64 }),
  })
  if (!res.ok) throw new Error('No se pudo subir el archivo')
  const json = (await res.json()) as { path: string }
  return json.path
}

function Section({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-blush-100 sm:p-7">
      <h2 className="font-display text-xl text-blush-700">{title}</h2>
      {description && <p className="mt-1 text-sm text-blush-400">{description}</p>}
      <div className="mt-5 flex flex-col gap-4">{children}</div>
    </section>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold tracking-wide text-blush-500 uppercase">
        {label}
      </span>
      {children}
    </label>
  )
}

const inputClass =
  'w-full rounded-lg border border-blush-200 bg-white px-3 py-2 text-sm text-blush-800 outline-none focus:border-blush-400 focus:ring-2 focus:ring-blush-100'

export function EditorApp() {
  const [data, setData] = useState<Content>(initialContent)
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const [error, setError] = useState('')
  const [uploadingPhotos, setUploadingPhotos] = useState(false)

  const update = <K extends keyof Content>(key: K, value: Content[K]) =>
    setData((d) => ({ ...d, [key]: value }))

  // ---- lists: charge messages ----
  const setMessage = (i: number, value: string) =>
    setData((d) => ({
      ...d,
      chargeMessages: d.chargeMessages.map((m, idx) => (idx === i ? value : m)),
    }))
  const addMessage = () =>
    setData((d) => ({ ...d, chargeMessages: [...d.chargeMessages, ''] }))
  const removeMessage = (i: number) =>
    setData((d) => ({ ...d, chargeMessages: d.chargeMessages.filter((_, idx) => idx !== i) }))

  // ---- lists: letter paragraphs ----
  const setParagraph = (i: number, value: string) =>
    setData((d) => ({
      ...d,
      letterParagraphs: d.letterParagraphs.map((p, idx) => (idx === i ? value : p)),
    }))
  const addParagraph = () =>
    setData((d) => ({ ...d, letterParagraphs: [...d.letterParagraphs, ''] }))
  const removeParagraph = (i: number) =>
    setData((d) => ({ ...d, letterParagraphs: d.letterParagraphs.filter((_, idx) => idx !== i) }))

  // ---- photos ----
  const movePhoto = (i: number, dir: -1 | 1) =>
    setData((d) => {
      const next = [...d.photos]
      const j = i + dir
      if (j < 0 || j >= next.length) return d
      ;[next[i], next[j]] = [next[j], next[i]]
      return { ...d, photos: next }
    })
  const removePhoto = (i: number) =>
    setData((d) => ({ ...d, photos: d.photos.filter((_, idx) => idx !== i) }))
  const setPhotoCaption = (i: number, caption: string) =>
    setData((d) => ({
      ...d,
      photos: d.photos.map((p, idx) => (idx === i ? { ...p, caption } : p)),
    }))

  const handlePhotoFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setUploadingPhotos(true)
    try {
      const uploaded: Photo[] = []
      for (const file of Array.from(files)) {
        const src = await uploadFile(file, 'photos')
        uploaded.push({ src, caption: '' })
      }
      setData((d) => ({ ...d, photos: [...d.photos, ...uploaded] }))
    } catch {
      setError('No se pudieron subir una o más fotos. Intenta de nuevo.')
    } finally {
      setUploadingPhotos(false)
    }
  }

  const handleFinalPhoto = async (files: FileList | null) => {
    const file = files?.[0]
    if (!file) return
    try {
      const src = await uploadFile(file, 'photos')
      update('finalPhoto', { ...data.finalPhoto, src })
    } catch {
      setError('No se pudo subir la foto final.')
    }
  }

  const handleMusic = async (files: FileList | null) => {
    const file = files?.[0]
    if (!file) return
    try {
      const src = await uploadFile(file, 'audio')
      update('musicSrc', src)
    } catch {
      setError('No se pudo subir la música.')
    }
  }

  const handleSave = async () => {
    setSaveState('saving')
    setError('')
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('save failed')
      setSaveState('saved')
      window.setTimeout(() => setSaveState('idle'), 2500)
    } catch {
      setSaveState('error')
      setError('No se pudo guardar. Revisa que `npm run dev` siga corriendo e intenta de nuevo.')
    }
  }

  return (
    <div className="min-h-screen bg-blush-50 pb-28">
      <header className="sticky top-0 z-20 border-b border-blush-100 bg-blush-50/90 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-5 py-4">
          <div>
            <h1 className="font-display text-2xl text-blush-700">Editor de contenido</h1>
            <p className="text-xs text-blush-400">
              Solo visible aquí, en tu computador, mientras corres <code>npm run dev</code>.
            </p>
          </div>
          <a
            href="/"
            className="flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-medium text-blush-600 shadow-sm ring-1 ring-blush-200"
          >
            Ver vista previa <ExternalLink size={14} />
          </a>
        </div>
      </header>

      <main className="mx-auto flex max-w-2xl flex-col gap-6 px-5 pt-6">
        <Section title="Datos básicos">
          <Field label="Nombre de quien recibe la sorpresa">
            <input
              className={inputClass}
              value={data.recipientName}
              onChange={(e) => update('recipientName', e.target.value)}
            />
          </Field>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Título de portada">
              <input
                className={inputClass}
                value={data.coverTitle}
                onChange={(e) => update('coverTitle', e.target.value)}
              />
            </Field>
            <Field label="Fecha (texto libre)">
              <input
                className={inputClass}
                placeholder="18 de junio"
                value={data.eventDate}
                onChange={(e) => update('eventDate', e.target.value)}
              />
            </Field>
          </div>
          <Field label="Subtítulo de portada">
            <input
              className={inputClass}
              value={data.coverSubtitle}
              onChange={(e) => update('coverSubtitle', e.target.value)}
            />
          </Field>
        </Section>

        <Section
          title="Mensajes al cargar el corazón"
          description="Van apareciendo mientras mantiene presionado el corazón."
        >
          {data.chargeMessages.map((m, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                className={inputClass}
                value={m}
                onChange={(e) => setMessage(i, e.target.value)}
              />
              <button
                type="button"
                onClick={() => removeMessage(i)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-blush-400 hover:bg-blush-50 hover:text-blush-600"
                aria-label="Eliminar mensaje"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addMessage}
            className="flex items-center gap-1.5 self-start rounded-lg px-3 py-1.5 text-sm font-medium text-blush-500 hover:bg-blush-50"
          >
            <Plus size={15} /> Agregar mensaje
          </button>
        </Section>

        <Section
          title="Fotos / recuerdos"
          description="Puedes subir todas las que quieras. Arrástralas con las flechas para reordenar."
        >
          <div className="flex flex-col gap-3">
            {data.photos.map((photo, i) => (
              <div
                key={photo.src + i}
                className="flex items-center gap-3 rounded-xl border border-blush-100 p-2"
              >
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-blush-100">
                  <PhotoImg
                    src={photo.src}
                    alt={photo.caption || `Foto ${i + 1}`}
                    index={i}
                    className="h-full w-full object-cover"
                  />
                </div>
                <input
                  className={inputClass}
                  placeholder="Descripción de la foto"
                  value={photo.caption}
                  onChange={(e) => setPhotoCaption(i, e.target.value)}
                />
                <div className="flex shrink-0 flex-col gap-1">
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => movePhoto(i, -1)}
                      disabled={i === 0}
                      className="flex h-8 w-8 items-center justify-center rounded-md text-blush-400 hover:bg-blush-50 hover:text-blush-600 disabled:opacity-30"
                      aria-label="Mover arriba"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => movePhoto(i, 1)}
                      disabled={i === data.photos.length - 1}
                      className="flex h-8 w-8 items-center justify-center rounded-md text-blush-400 hover:bg-blush-50 hover:text-blush-600 disabled:opacity-30"
                      aria-label="Mover abajo"
                    >
                      <ArrowDown size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => removePhoto(i)}
                      className="flex h-8 w-8 items-center justify-center rounded-md text-blush-400 hover:bg-blush-50 hover:text-blush-600"
                      aria-label="Eliminar foto"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-blush-200 py-4 text-sm font-medium text-blush-500 hover:border-blush-300 hover:bg-blush-50">
            <Upload size={16} />
            {uploadingPhotos ? 'Subiendo...' : 'Agregar fotos'}
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              disabled={uploadingPhotos}
              onChange={(e) => handlePhotoFiles(e.target.files)}
            />
          </label>
        </Section>

        <Section title="La carta">
          <Field label="Título">
            <input
              className={inputClass}
              value={data.letterTitle}
              onChange={(e) => update('letterTitle', e.target.value)}
            />
          </Field>
          {data.letterParagraphs.map((p, i) => (
            <div key={i} className="flex items-start gap-2">
              <textarea
                className={`${inputClass} min-h-20 resize-y`}
                value={p}
                onChange={(e) => setParagraph(i, e.target.value)}
              />
              <button
                type="button"
                onClick={() => removeParagraph(i)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-blush-400 hover:bg-blush-50 hover:text-blush-600"
                aria-label="Eliminar párrafo"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addParagraph}
            className="flex items-center gap-1.5 self-start rounded-lg px-3 py-1.5 text-sm font-medium text-blush-500 hover:bg-blush-50"
          >
            <Plus size={15} /> Agregar párrafo
          </button>
          <Field label="Firma">
            <input
              className={inputClass}
              value={data.letterSignature}
              onChange={(e) => update('letterSignature', e.target.value)}
            />
          </Field>
        </Section>

        <Section
          title="El pastel y el deseo"
          description="Las velas muestran la edad. Al soplarlas aparece el segundo texto."
        >
          <Field label="Edad (las velas)">
            <input
              className={inputClass}
              value={data.age}
              onChange={(e) => update('age', e.target.value)}
            />
          </Field>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Texto antes de soplar">
              <input
                className={inputClass}
                value={data.wishPrompt}
                onChange={(e) => update('wishPrompt', e.target.value)}
              />
            </Field>
            <Field label="Texto después de soplar">
              <input
                className={inputClass}
                value={data.wishDone}
                onChange={(e) => update('wishDone', e.target.value)}
              />
            </Field>
          </div>
        </Section>

        <Section title="Escena final">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Título">
              <input
                className={inputClass}
                value={data.finalTitle}
                onChange={(e) => update('finalTitle', e.target.value)}
              />
            </Field>
            <Field label="Mensaje">
              <input
                className={inputClass}
                value={data.finalMessage}
                onChange={(e) => update('finalMessage', e.target.value)}
              />
            </Field>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-blush-100">
              <PhotoImg
                src={data.finalPhoto.src}
                alt={data.finalPhoto.caption}
                index={0}
                className="h-full w-full object-cover"
              />
            </div>
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-blush-200 px-3 py-2 text-sm font-medium text-blush-500 hover:bg-blush-50">
              <Upload size={14} />
              Cambiar foto final
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFinalPhoto(e.target.files)}
              />
            </label>
          </div>
        </Section>

        <Section title="Música de fondo (opcional)">
          <div className="flex items-center gap-3">
            <Music2 size={18} className="shrink-0 text-blush-400" />
            <p className="flex-1 text-sm text-blush-500">
              {data.musicSrc ? data.musicSrc.split('/').pop() : 'Sin música seleccionada'}
            </p>
            {data.musicSrc && (
              <button
                type="button"
                onClick={() => update('musicSrc', '')}
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-blush-500 hover:bg-blush-50"
              >
                Quitar
              </button>
            )}
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-blush-200 px-3 py-2 text-sm font-medium text-blush-500 hover:bg-blush-50">
              <Upload size={14} />
              Subir mp3
              <input
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={(e) => handleMusic(e.target.files)}
              />
            </label>
          </div>
        </Section>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-blush-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-4 px-5 py-3">
          <span className="text-sm text-blush-500">
            {saveState === 'saved' && '✓ Guardado'}
            {saveState === 'error' && error}
            {saveState === 'idle' && ' '}
            {saveState === 'saving' && 'Guardando...'}
          </span>
          <button
            type="button"
            onClick={handleSave}
            disabled={saveState === 'saving'}
            className="flex items-center gap-2 rounded-full bg-blush-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blush-500/30 disabled:opacity-60"
          >
            <Save size={16} />
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  )
}
