import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import type { Plugin } from 'vite'
import { formatLayout, validateLayout } from '../src/studio/layout/registry'
import type { LayoutFile } from '../src/studio/layout/registry'

/** DEV-ONLY (apply: 'serve'): POST /__cabin-layout writes ONLY src/studio/layout/layout.json after validating ids and numeric bounds. Never runs in `vite build`. */
export function cabinLayoutWriter(): Plugin {
  let target = ''
  return {
    name: 'cabin-layout-writer',
    apply: 'serve',
    configureServer(server) {
      target = resolve(server.config.root, 'src/studio/layout/layout.json')
      server.middlewares.use('/__cabin-layout', (incoming, outgoing) => {
        const request = incoming as unknown as { method?: string; headers: Record<string, string | undefined> }
        const response = outgoing as unknown as { statusCode: number; setHeader: (key: string, value: string) => void; end: (body: string) => void }
        const reply = (status: number, body: object) => { response.statusCode = status; response.setHeader('Content-Type', 'application/json'); response.end(JSON.stringify(body)) }
        const host = String(request.headers.host ?? '')
        if (!/^(127\.0\.0\.1|localhost)(:\d+)?$/.test(host)) return reply(403, { ok: false, error: 'local development only' })
        if (request.method !== 'POST') return reply(405, { ok: false, error: 'POST only' })
        let body = ''
        const stream = incoming as unknown as { on: (event: string, cb: (chunk?: unknown) => void) => void; destroy: () => void }
        stream.on('data', chunk => { body += String(chunk); if (body.length > 200_000) stream.destroy() })
        stream.on('end', () => {
          try {
            const file = JSON.parse(body) as LayoutFile
            const error = validateLayout(file)
            if (error) return reply(400, { ok: false, error })
            void writeFile(target, formatLayout(file)).then(() => reply(200, { ok: true, file: 'src/studio/layout/layout.json' }), () => reply(500, { ok: false, error: 'write failed' }))
          } catch { reply(400, { ok: false, error: 'invalid JSON' }) }
        })
      })
    },
  }
}
