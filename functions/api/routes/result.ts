import { Hono } from 'hono'
import { KVNamespace } from '@cloudflare/workers-types'

type Bindings = {
  RANDOM_WEAPONS: KVNamespace
}

const result = new Hono<{ Bindings: Bindings }>().get('/', async (c) => {
  let results = await c.env.RANDOM_WEAPONS.get('results', 'json')
  return c.json(results)
})

export default result
