import { Hono } from 'hono'
import { D1Database } from '@cloudflare/workers-types'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

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

// Schema for validating the query parameters
const randomWeaponQuerySchema = z.object({
  count: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val > 0, {
      message: 'Count must be a positive integer',
    }),
})

// Accessing D1 is via the c.env.YOUR_BINDING property
const weapon = new Hono<{ Bindings: Bindings }>()
  .get('/', async (c) => {
    let { results } = await c.env.DB.prepare('SELECT * FROM Weapons;').all()
    return c.json(results)
  })
  .get('/random', zValidator('query', randomWeaponQuerySchema), async (c) => {
    const { count } = c.req.valid('query')
    let { results }: Weapons = await c.env.DB.prepare(
      `SELECT * FROM Weapons ORDER BY RANDOM() LIMIT ${count};`
    ).all()
    return c.json(results)
  })

export default weapon
