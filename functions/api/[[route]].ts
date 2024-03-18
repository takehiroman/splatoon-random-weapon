import { handle } from 'hono/cloudflare-pages'
import { Hono } from 'hono'
import { cors } from 'hono/cors'

import weapon from './routes/weapon'
import result from './routes/result'

export const runtime = 'edge'

const app = new Hono().basePath('/api')

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

const route = app.route('/weapons', weapon).route('/results', result)

export type AppType = typeof route
export const onRequest = handle(app)
