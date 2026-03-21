import { Hono } from 'hono'
import { KVNamespace } from '@cloudflare/workers-types'

type Bindings = {
  RANDOM_WEAPONS: KVNamespace
}

const RESULT_HISTORY_KEY = 'results'
const MAX_HISTORY_ITEMS = 20

export type ResultHistoryItem = {
  id: string
  title: string
  weaponList: string[]
  createdAt: string
}

type CreateResultPayload = {
  weaponList?: string[]
}

const createResultId = () =>
  `result-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`

const result = new Hono<{ Bindings: Bindings }>()
  .get('/', async (c) => {
    const results =
      (await c.env.RANDOM_WEAPONS.get<ResultHistoryItem[]>(
        RESULT_HISTORY_KEY,
        'json'
      )) ??
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
      (await c.env.RANDOM_WEAPONS.get<ResultHistoryItem[]>(
        RESULT_HISTORY_KEY,
        'json'
      )) ??
      []
    const createdAt = new Date().toISOString()
    const nextResult: ResultHistoryItem = {
      id: createResultId(),
      title: `結果 ${currentResults.length + 1}`,
      weaponList,
      createdAt,
    }
    // Keep a single bounded list in KV so reads/writes stay simple and within free-tier usage.
    const nextResults = [nextResult, ...currentResults].slice(0, MAX_HISTORY_ITEMS)

    await c.env.RANDOM_WEAPONS.put(RESULT_HISTORY_KEY, JSON.stringify(nextResults))

    return c.json(nextResult, 201)
  })

export default result
