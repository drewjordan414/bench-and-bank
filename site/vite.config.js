import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { MongoClient } from 'mongodb'
import { cleanTrips, TripError } from './src/trips.js'

// The trip log is a file in the repo, not browser storage: it survives a cleared browser and can be backed up.
const FILE = fileURLToPath(new URL('../data/trips.json', import.meta.url))

// A second copy on the homelab. The file above stays the source of truth: MONGO_URL (site/.env.local) names a database,
// and its `trips` collection is made to match the file after every save and whenever the log is read.
// Away from home the copy simply falls behind and catches up later. Returns 'off', 'ok' or 'failed'; never throws.
function mirrorTo(url) {
  if (!url) return async () => 'off'
  const client = new MongoClient(url, { serverSelectionTimeoutMS: 2500 }) // short: a save must not hang off the LAN
  let queue = Promise.resolve() // one sync at a time, in order, so an older copy can never land after a newer one
  return trips => (queue = queue.then(async () => {
    try {
      const col = client.db().collection('trips')
      if (trips.length) await col.bulkWrite(trips.map(({ id, ...t }) => ({ replaceOne: { filter: { _id: id }, replacement: t, upsert: true } })))
      await col.deleteMany({ _id: { $nin: trips.map(t => t.id) } })
      return 'ok'
    } catch (e) {
      console.warn(`[trips] copy to MongoDB failed: ${e.message}`)
      return 'failed'
    }
  }))
}

// The log may only be asked for under a name this server knows: localhost, an IP address, or a name listed in
// ALLOWED_HOSTS. That is what stops DNS rebinding, where a hostile page points its own domain at this machine.
const knownHost = (host = '', allowed) => {
  const name = host.replace(/:\d+$/, '').toLowerCase()
  return name === 'localhost' || /^\d{1,3}(\.\d{1,3}){3}$/.test(name) || /^\[[0-9a-f:]+\]$/.test(name) || allowed.includes(name)
}

function tripsApi(mongoUrl, allowedHosts) {
  const mirror = mirrorTo(mongoUrl)
  const handle = async (req, res, next) => {
    if (req.url.split('?')[0] !== '/api/trips') return next()
    const send = (code, body) => { res.statusCode = code; res.setHeader('Content-Type', 'application/json'); res.setHeader('Cache-Control', 'no-store'); res.end(JSON.stringify(body)) }
    if (!knownHost(req.headers.host, allowedHosts)) return send(403, { error: 'Unknown host.' })
    try {
      if (req.method === 'GET') {
        const file = await fs.readFile(FILE, 'utf8').catch(e => { if (e.code === 'ENOENT') return '[]'; throw e })
        const trips = cleanTrips(JSON.parse(file))
        mirror(trips) // catch the copy up in the background; reading the log never waits on it
        return send(200, trips)
      }
      if (req.method !== 'PUT') return send(405, { error: 'GET or PUT only.' })
      // Another website open in the browser must not be able to rewrite the log. A JSON content type forces a CORS
      // preflight, which this server never answers, and any Origin sent has to be this site itself.
      const origin = req.headers.origin
      if (!/^application\/json\b/.test(req.headers['content-type'] || '') || (origin && new URL(origin).host !== req.headers.host)) return send(403, { error: 'Not allowed.' })
      let body = ''
      for await (const chunk of req) { body += chunk; if (body.length > 2e6) return send(413, { error: 'Too large.' }) }
      let trips
      try { trips = cleanTrips(JSON.parse(body)) } catch (e) { return send(400, { error: e instanceof TripError ? e.message : 'Not valid JSON.' }) }
      await fs.mkdir(path.dirname(FILE), { recursive: true })
      await fs.copyFile(FILE, FILE.replace(/\.json$/, '.backup.json')).catch(() => {}) // the previous save, in case this one is a mistake
      await fs.writeFile(FILE + '.tmp', JSON.stringify(trips, null, 1))
      await fs.rename(FILE + '.tmp', FILE) // never a half-written log
      res.setHeader('X-Mirror', await mirror(trips))
      send(200, trips)
    } catch (e) {
      send(500, { error: `The trip log file could not be read or written: ${e.message}` })
    }
  }
  const use = server => { server.middlewares.use(handle) }
  return { name: 'trips-api', configureServer: use, configurePreviewServer: use }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, fileURLToPath(new URL('.', import.meta.url)), ['MONGO_', 'ALLOWED_'])
  // Extra hostnames the site may be opened under, comma-separated, e.g. bench.home. Localhost and IP addresses always work.
  const allowedHosts = (env.ALLOWED_HOSTS || '').split(',').map(h => h.trim().toLowerCase()).filter(Boolean)
  return {
    plugins: [react(), tripsApi(env.MONGO_URL, allowedHosts)],
    base: './',
    server: { allowedHosts },
    preview: { allowedHosts }, // in Docker the built site is served by `vite preview`
  }
})
