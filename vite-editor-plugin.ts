import fs from 'node:fs'
import path from 'node:path'
import type { Plugin } from 'vite'

const ROOT = process.cwd()
const CONTENT_PATH = path.resolve(ROOT, 'src/content.data.json')

function readJsonBody(req: import('node:http').IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', (chunk) => {
      body += chunk
      if (body.length > 25 * 1024 * 1024) {
        reject(new Error('Payload demasiado grande'))
        req.destroy()
      }
    })
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {})
      } catch (err) {
        reject(err)
      }
    })
    req.on('error', reject)
  })
}

function sanitizeFilename(name: string): string {
  const ext = path.extname(name).toLowerCase().replace(/[^a-z0-9.]/g, '') || ''
  const base = path
    .basename(name, path.extname(name))
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40)
  return `${Date.now()}-${base || 'archivo'}${ext}`
}

function sendJson(res: import('node:http').ServerResponse, status: number, data: unknown) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(data))
}

/**
 * Dev-only local API used by the /editor page:
 *  - POST /api/content  { ...full content object... }  -> overwrites src/content.data.json
 *  - POST /api/upload    { filename, folder, dataBase64 } -> writes into public/<folder>/
 * Never runs in the production build — only exists while `npm run dev` is active.
 */
export function editorApiPlugin(): Plugin {
  return {
    name: 'editor-api',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/content', async (req, res, next) => {
        if (req.method === 'GET') {
          try {
            const raw = fs.readFileSync(CONTENT_PATH, 'utf-8')
            sendJson(res, 200, JSON.parse(raw))
          } catch (err) {
            sendJson(res, 500, { ok: false, error: String(err) })
          }
          return
        }
        if (req.method !== 'POST') return next()
        try {
          const data = await readJsonBody(req)
          fs.writeFileSync(CONTENT_PATH, JSON.stringify(data, null, 2) + '\n', 'utf-8')
          sendJson(res, 200, { ok: true })
        } catch (err) {
          sendJson(res, 400, { ok: false, error: String(err) })
        }
      })

      server.middlewares.use('/api/upload', async (req, res, next) => {
        if (req.method !== 'POST') return next()
        try {
          const body = (await readJsonBody(req)) as {
            filename?: string
            folder?: string
            dataBase64?: string
          }
          const folder = body.folder === 'audio' ? 'audio' : 'photos'
          if (!body.filename || !body.dataBase64) {
            sendJson(res, 400, { ok: false, error: 'Falta filename o dataBase64' })
            return
          }
          const safeName = sanitizeFilename(body.filename)
          const dir = path.resolve(ROOT, 'public', folder)
          fs.mkdirSync(dir, { recursive: true })
          const dest = path.join(dir, safeName)
          fs.writeFileSync(dest, Buffer.from(body.dataBase64, 'base64'))
          sendJson(res, 200, { ok: true, path: `/${folder}/${safeName}` })
        } catch (err) {
          sendJson(res, 400, { ok: false, error: String(err) })
        }
      })
    },
  }
}
