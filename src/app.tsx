import { h, Fragment } from 'preact'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { CardList } from '@/components/CardList'
import { SelectBox } from '@/components/SelectBox'
import { useState } from 'preact/hooks'
import { hc } from 'hono/client'
import { AppType, Weapon } from '../functions/api/[[route]]'
import useSWR from 'swr'
export function App() {
  const client = hc<AppType>('/')
  const $get = client.api.weapons.$get
  const $random = (count: string) =>
    client.api.weapons.random.$get({
      query: {
        count,
      },
    })
  const [weaponList, setWeaponList] = useState<string[]>([])
  const [person, setPerson] = useState('1')
  const fetcher = (arg: any) => async () => {
    const res = await $get(arg)
    return await res.json()
  }
  const { data } = useSWR('weapons', fetcher({}), {
    revalidateOnFocus: false,
  })
  const cards = [
    {
      title: '結果１',
      weaponList: ['52ガロン', 'N-ZAP85', 'スプラローラー', 'スプラシューター'],
    },
    {
      title: '結果２',
      weaponList: [
        'スプラチャージャー',
        'スプラスコープ',
        'スプラマニューバー',
        'スプラマニューバーコラボ',
      ],
    },
    {
      title: '結果３',
      weaponList: [
        'スプラスピナー',
        'スプラスピナーコラボ',
        'スプラシューターコラボ',
        'スプラローラー',
      ],
    },
  ]

  const optionList = [
    { label: '1人', value: '1' },
    { label: '2人', value: '2' },
    { label: '3人', value: '3' },
    { label: '4人', value: '4' },
  ]
  // optionListで選択した人数分の武器をランダムで取得してて、それをweaponListに入れる
  const handleClick = async (person: string) => {
    const randomResponse = await $random(person)
    console.log(randomResponse)
    const randomWeaponList: string[] = (await randomResponse.json()).map(
      (weapon: Weapon) => weapon.weaponName
    )
    setWeaponList(randomWeaponList)
  }
  // 人数を選択するセレクトボックス
  const setOnChangePerson = (value: string) => {
    setPerson(value)
  }
  return (
    <>
      <div class="flex m-6 justify-center">
        <SelectBox
          title="人数"
          optionList={optionList}
          onChange={(e) => setOnChangePerson(e)}
        />
      </div>
      <p>json: {JSON.stringify(data)}</p>
      {weaponList.length > 0 && (
        <div class="flex justify-center">
          <Card title="結果" weaponList={weaponList} />
        </div>
      )}
      <div class="flex m-4 justify-center">
        <Button text="スタート" onClick={() => handleClick(person)} />
      </div>
      <CardList cards={cards} />
    </>
  )
}
