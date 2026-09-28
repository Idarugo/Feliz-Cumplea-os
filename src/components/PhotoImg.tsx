const FALLBACKS = ['/photos/1.svg', '/photos/2.svg', '/photos/3.svg']

/** Renders a photo, falling back to a labeled placeholder if the real file isn't there yet. */
export function PhotoImg({
  src,
  alt,
  index = 0,
  className,
}: {
  src: string
  alt: string
  index?: number
  className?: string
}) {
  return (
    <img
      src={src}
      alt={alt}
      draggable={false}
      className={className}
      onError={(e) => {
        const fallback = FALLBACKS[index % FALLBACKS.length]
        if (e.currentTarget.src.endsWith(fallback)) return
        e.currentTarget.src = fallback
      }}
    />
  )
}
