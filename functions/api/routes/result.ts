import { Hono } from 'hono'
import { KVNamespace } from '@cloudflare/workers-types'

type Bindings = {
  RANDOM_WEAPONS: KVNamespace
}

export type ResultHistoryItem = {
  id: string
  title: string
  weaponList: string[]
  createdAt: string
}

type CreateResultPayload = {
  weaponList?: string[]
}

const result = new Hono<{ Bindings: Bindings }>()
  .get('/', async (c) => {
    const results =
      (await c.env.RANDOM_WEAPONS.get<ResultHistoryItem[]>('results', 'json')) ??
      []
    return c.json(results)
  })
  .post('/', async (c) => {
    const body = (await c.req.json()) as CreateResultPayload
    const weaponList = body.weaponList?.filter(Boolean) ?? []

    if (weaponList.length === 0) {
      return c.json({ message: 'weaponList is required' }, 400)
    }

    const currentResults =
      (await c.env.RANDOM_WEAPONS.get<ResultHistoryItem[]>('results', 'json')) ??
      []
    const nextResult: ResultHistoryItem = {
      id: crypto.randomUUID(),
      title: `結果 ${currentResults.length + 1}`,
      weaponList,
      createdAt: new Date().toISOString(),
    }
    const nextResults = [nextResult, ...currentResults].slice(0, 10)

    await c.env.RANDOM_WEAPONS.put('results', JSON.stringify(nextResults))

    return c.json(nextResult, 201)
  })

export default result
