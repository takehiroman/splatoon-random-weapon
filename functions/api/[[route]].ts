import { D1Database } from '@cloudflare/workers-types'
import { handle } from 'hono/cloudflare-pages'
import { Hono } from 'hono'
import { cors } from 'hono/cors'

export const runtime = 'edge'

type Bindings = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>().basePath('/api')

app.use(
  '*',
  cors({
    origin: '*',
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
    credentials: true,
  })
)

// Accessing D1 is via the c.env.YOUR_BINDING property
const route = app.get('/weapons', async (c) => {
  let { results } = await c.env.DB.prepare('SELECT * FROM Weapons;').all()
  return c.json(results)
})
// Weaponsからランダムで引数で設定された種類返すSQL
app.get('/weapons/random', async (c) => {
  const { count } = c.req.query()
  let { results } = await c.env.DB.prepare(
    `SELECT * FROM Weapons ORDER BY RANDOM() LIMIT ${count};`
  ).all()
  return c.json(results)
})

export type AppType = typeof route
export const onRequest = handle(app)
