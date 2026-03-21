import { h, Fragment } from 'preact'
import { useState } from 'preact/hooks'

import { hc } from 'hono/client'

import useSWR from 'swr'

import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { CardList } from '@/components/CardList'
import { SelectBox } from '@/components/SelectBox'

import { AppType } from '../functions/api/[[route]]'
import { ResultHistoryItem } from '../functions/api/routes/result'
import { Weapon } from '../functions/api/routes/weapon'

type ApiError = {
  message: string
}

export function App() {
  const client = hc<AppType>('/')
  const [weaponList, setWeaponList] = useState<string[]>([])
  const [person, setPerson] = useState('1')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const $random = async (count: string) =>
    client.api.weapons.random.$get({
      query: {
        count,
      },
    })
  const fetchResults = async () => {
    const res = await client.api.results.$get()

    if (!res.ok) {
      throw new Error('履歴の取得に失敗しました')
    }

    const json = await res.json()
    return Array.isArray(json) ? (json as ResultHistoryItem[]) : []
  }
  const { data, error, mutate, isLoading } = useSWR('results', fetchResults, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateOnMount: false, // Disable revalidation for performance reasons. Data is updated via another mechanism.
  })

  const optionList = [
    { label: '1人', value: '1' },
    { label: '2人', value: '2' },
    { label: '3人', value: '3' },
    { label: '4人', value: '4' },
  ]

  const createResult = async (nextWeaponList: string[]) => {
    const res = await client.api.results.$post({
      json: {
        weaponList: nextWeaponList,
      },
    })

    if (!res.ok) {
      const errorResponse = (await res.json()) as ApiError
      throw new Error(errorResponse.message ?? '結果の保存に失敗しました')
    }

    return (await res.json()) as ResultHistoryItem
  }

  const handleClick = async (person: string) => {
    setIsSubmitting(true)
    setErrorMessage('')

    try {
      const randomResponse = await $random(person)

      if (!randomResponse.ok) {
        throw new Error('武器の抽選に失敗しました')
      }

      const randomResponseJson = (await randomResponse.json()) as
        | Weapon[]
        | ApiError

      if (!Array.isArray(randomResponseJson)) {
        throw new Error(
          randomResponseJson.message ?? '武器の抽選に失敗しました'
        )
      }

      const randomWeaponList: string[] = randomResponseJson.map(
        (weapon: Weapon) => weapon.weaponName
      )

      setWeaponList(randomWeaponList)
      const savedResult = await createResult(randomWeaponList)
      await mutate(
        (currentResults = []) => [savedResult, ...currentResults].slice(0, 20),
        false
      )
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : '処理中にエラーが発生しました'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const setOnChangePerson = (value: string) => {
    setPerson(value)
  }

  const historyCards =
    data?.map((item) => ({
      id: item.id,
      title: item.title,
      subtitle: new Date(item.createdAt).toLocaleString('ja-JP'),
      weaponList: item.weaponList,
    })) ?? []

  return (
    <>
      <div class="min-h-screen bg-slate-100">
        <div class="mx-auto max-w-5xl px-4 py-8">
          <div class="mb-8 text-center">
            <h1 class="text-3xl font-bold text-slate-800">
              Splatoon Random Weapon
            </h1>
            <p class="mt-2 text-slate-600">
              人数を選ぶと、その場のチーム武器をランダムに決定します。
            </p>
          </div>

          <div class="mb-8 rounded-xl bg-white p-6 shadow-md">
            <div class="flex flex-col items-center gap-4 md:flex-row md:justify-center">
              <SelectBox
                title="人数"
                optionList={optionList}
                onChange={(e) => setOnChangePerson(e)}
                value={person}
              />
              <div class="pt-5">
                <Button
                  text={isSubmitting ? '抽選中...' : 'スタート'}
                  onClick={() => handleClick(person)}
                  disabled={isSubmitting}
                />
              </div>
            </div>
            {errorMessage && (
              <p class="mt-4 text-center text-sm text-red-500">
                {errorMessage}
              </p>
            )}
          </div>

          {weaponList.length > 0 && (
            <div class="mb-8 flex justify-center">
              <Card title="今回の結果" weaponList={weaponList} />
            </div>
          )}

          <section>
            <div class="mb-4 flex items-center justify-between">
              <h2 class="text-2xl font-bold text-slate-800">履歴</h2>
              {isLoading && <p class="text-sm text-slate-500">読み込み中...</p>}
            </div>
            {error && (
              <p class="mb-4 text-sm text-red-500">
                履歴を取得できませんでした。
              </p>
            )}
            {!isLoading && !error && historyCards.length === 0 && (
              <div class="rounded-xl bg-white p-6 text-center text-slate-500 shadow-md">
                まだ履歴がありません。最初の抽選をしてみましょう。
              </div>
            )}
            {historyCards.length > 0 && <CardList cards={historyCards} />}
          </section>
        </div>
      </div>
    </>
  )
}
