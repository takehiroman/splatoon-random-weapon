import { Hono } from 'hono'
import { D1Database, KVNamespace } from '@cloudflare/workers-types'

type Bindings = {
  DB: D1Database
  RANDOM_WEAPONS?: KVNamespace
}

const RESULT_HISTORY_KEY = 'results'
const RESULT_HISTORY_TABLE = 'ResultHistory'
const MAX_HISTORY_ITEMS = 20

export type ResultHistoryItem = {
  id: string
  title: string
  weaponList: string[]
  createdAt: string
}

type CreateResultPayload = {
  weaponList?: unknown
}

const createResultId = () =>
  `result-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`

type ResultHistoryRow = {
  id: string
  title: string
  weaponList: string
  createdAt: string
}

const normalizeWeaponList = (value: unknown): string[] =>
  Array.isArray(value)
    ? value.filter(
        (weapon): weapon is string =>
          typeof weapon === 'string' && weapon.trim().length > 0
      )
    : []

const normalizeResultHistoryItem = (value: unknown): ResultHistoryItem | null => {
  if (!value || typeof value !== 'object') {
    return null
  }

  const candidate = value as Record<string, unknown>
  const weaponList = normalizeWeaponList(candidate.weaponList)

  if (
    typeof candidate.id !== 'string' ||
    typeof candidate.title !== 'string' ||
    typeof candidate.createdAt !== 'string' ||
    weaponList.length === 0
  ) {
    return null
  }

  return {
    id: candidate.id,
    title: candidate.title,
    weaponList,
    createdAt: candidate.createdAt,
  }
}

const parseStoredWeaponList = (value: string): string[] => {
  try {
    return normalizeWeaponList(JSON.parse(value))
  } catch {
    return []
  }
}

const parseResultHistoryRow = (row: ResultHistoryRow): ResultHistoryItem | null => {
  const weaponList = parseStoredWeaponList(row.weaponList)

  if (
    typeof row.id !== 'string' ||
    typeof row.title !== 'string' ||
    typeof row.createdAt !== 'string' ||
    weaponList.length === 0
  ) {
    return null
  }

  return {
    id: row.id,
    title: row.title,
    weaponList,
    createdAt: row.createdAt,
  }
}

const ensureResultHistoryTable = async (db: D1Database) => {
  await db.exec(
    `CREATE TABLE IF NOT EXISTS ${RESULT_HISTORY_TABLE} (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      weaponList TEXT NOT NULL,
      createdAt TEXT NOT NULL
    );`
  )
}

const pruneResultHistory = async (db: D1Database) => {
  await db.exec(
    `DELETE FROM ${RESULT_HISTORY_TABLE}
     WHERE id NOT IN (
       SELECT id
       FROM ${RESULT_HISTORY_TABLE}
       ORDER BY createdAt DESC, id DESC
       LIMIT ${MAX_HISTORY_ITEMS}
     );`
  )
}

const seedResultHistoryFromKv = async (env: Bindings) => {
  if (!env.RANDOM_WEAPONS) {
    return
  }

  const countRow = await env.DB.prepare(
    `SELECT COUNT(*) AS count FROM ${RESULT_HISTORY_TABLE};`
  ).first<{ count: number }>()

  if (Number(countRow?.count ?? 0) > 0) {
    return
  }

  let kvResults: unknown

  try {
    kvResults = await env.RANDOM_WEAPONS.get<unknown>(
      RESULT_HISTORY_KEY,
      'json'
    )
  } catch (error) {
    console.error('Failed to read legacy KV result history', error)
    return
  }

  if (!Array.isArray(kvResults)) {
    return
  }

  const normalizedResults = kvResults
    .map(normalizeResultHistoryItem)
    .filter((item): item is ResultHistoryItem => item !== null)

  if (normalizedResults.length === 0) {
    return
  }

  await env.DB.batch(
    normalizedResults.map((item) =>
      env.DB.prepare(
        `INSERT OR IGNORE INTO ${RESULT_HISTORY_TABLE} (id, title, weaponList, createdAt)
         VALUES (?, ?, ?, ?);`
      ).bind(
        item.id,
        item.title,
        JSON.stringify(item.weaponList),
        item.createdAt
      )
    )
  )

  await pruneResultHistory(env.DB)
}

const ensureResultHistoryStore = async (env: Bindings) => {
  await ensureResultHistoryTable(env.DB)
  await seedResultHistoryFromKv(env)
}

const loadResultHistory = async (db: D1Database): Promise<ResultHistoryItem[]> => {
  const { results } = await db
    .prepare(
      `SELECT id, title, weaponList, createdAt
       FROM ${RESULT_HISTORY_TABLE}
       ORDER BY createdAt DESC, id DESC
       LIMIT ${MAX_HISTORY_ITEMS};`
    )
    .all<ResultHistoryRow>()

  return (results ?? [])
    .map(parseResultHistoryRow)
    .filter((item): item is ResultHistoryItem => item !== null)
}

const getNextResultTitle = async (db: D1Database) => {
  const latestResult = await db
    .prepare(
      `SELECT title
       FROM ${RESULT_HISTORY_TABLE}
       ORDER BY createdAt DESC, id DESC
       LIMIT 1;`
    )
    .first<{ title: string }>()

  const latestNumber = latestResult?.title.match(/^結果 (\d+)$/)?.[1]

  return `結果 ${latestNumber ? Number.parseInt(latestNumber, 10) + 1 : 1}`
}

const result = new Hono<{ Bindings: Bindings }>()
  .get('/', async (c) => {
    try {
      await ensureResultHistoryStore(c.env)
      const results = await loadResultHistory(c.env.DB)
      return c.json(results)
    } catch (error) {
      console.error('Failed to fetch result history', error)
      return c.json({ message: '履歴の取得に失敗しました' }, 500)
    }
  })
  .post('/', async (c) => {
    let body: CreateResultPayload

    try {
      body = (await c.req.json()) as CreateResultPayload
    } catch {
      return c.json({ message: 'Invalid JSON body' }, 400)
    }

    const weaponList = normalizeWeaponList(body.weaponList)

    if (weaponList.length === 0) {
      return c.json({ message: 'weaponList is required' }, 400)
    }

    try {
      await ensureResultHistoryStore(c.env)

      const createdAt = new Date().toISOString()
      const nextResult: ResultHistoryItem = {
        id: createResultId(),
        title: await getNextResultTitle(c.env.DB),
        weaponList,
        createdAt,
      }

      await c.env.DB.prepare(
        `INSERT INTO ${RESULT_HISTORY_TABLE} (id, title, weaponList, createdAt)
         VALUES (?, ?, ?, ?);`
      )
        .bind(
          nextResult.id,
          nextResult.title,
          JSON.stringify(nextResult.weaponList),
          nextResult.createdAt
        )
        .run()

      await pruneResultHistory(c.env.DB)

      return c.json(nextResult, 201)
    } catch (error) {
      console.error('Failed to save result history', error)
      return c.json({ message: '結果の保存に失敗しました' }, 500)
    }
  })

export default result
