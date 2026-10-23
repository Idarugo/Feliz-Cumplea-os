import raw from './content.data.json'

export type Photo = {
  src: string
  caption: string
}

export type Content = {
  recipientName: string
  age: string
  coverTitle: string
  coverSubtitle: string
  eventDate: string
  chargeMessages: string[]
  photos: Photo[]
  letterTitle: string
  letterParagraphs: string[]
  letterSignature: string
  wishPrompt: string
  wishDone: string
  finalTitle: string
  finalMessage: string
  finalPhoto: Photo
  musicSrc: string
}

/**
 * All personalizable data lives in `content.data.json`.
 * Edit it by hand, or visit /editor while `npm run dev` is running
 * for a visual editor (name, date, letter, photo upload/reorder, music).
 */
export const content: Content = raw as Content
