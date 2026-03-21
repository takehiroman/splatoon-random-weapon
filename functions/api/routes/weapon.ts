import { Hono } from 'hono'
import { D1Database } from '@cloudflare/workers-types'

type Bindings = {
  DB: D1Database
}

export type Weapon = {
  weaponId: number
  weaponName: string
  weaponCategory: string
  weaponSub: string
  weaponSpecial: string
}

export type Weapons = {
  results: Weapon[]
}

// Accessing D1 is via the c.env.YOUR_BINDING property
const weapon = new Hono<{ Bindings: Bindings }>()
  .get('/', async (c) => {
    let { results } = await c.env.DB.prepare('SELECT * FROM Weapons;').all()
    return c.json(results)
  })
  .get('/random', async (c) => {
    const { count } = c.req.query()
    const parsedCount = Number.parseInt(count ?? '', 10)

    if (!Number.isInteger(parsedCount) || parsedCount < 1 || parsedCount > 4) {
      return c.json({ message: 'count must be an integer between 1 and 4' }, 400)
    }

    let { results }: Weapons = await c.env.DB.prepare(
      `SELECT * FROM Weapons ORDER BY RANDOM() LIMIT ${parsedCount};`
    ).all()
    return c.json(results)
  })

export default weapon
