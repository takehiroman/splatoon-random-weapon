import { h, Fragment } from 'preact'
import { Button } from './components/Button'
import { CardList } from './components/CardList'
export function App() {
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
  const handleClick = () => {
    alert('Hello!')
  }
  return (
    <>
      <CardList cards={cards} />
      <div class="flex m-4 justify-center">
        <Button text="スタート" onClick={handleClick} />
      </div>
    </>
  )
}
