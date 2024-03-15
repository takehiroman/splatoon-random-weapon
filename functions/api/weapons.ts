import { D1Database } from '@cloudflare/workers-types'
import { handle } from 'hono/cloudflare-pages'
import { Hono } from 'hono'

export const runtime = 'edge'

type Bindings = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>().basePath('/api')

// Accessing D1 is via the c.env.YOUR_BINDING property
app.get('/weapons', async (c) => {
  let { results } = await c.env.DB.prepare('SELECT * FROM Weapons').all()
  return c.json(results)
})

export default handle(app)
