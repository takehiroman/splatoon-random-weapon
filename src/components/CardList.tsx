import { h, FunctionComponent } from 'preact'
import { Card } from './Card'

type CardListProps = {
  cards: {
    id?: string
    title: string
    subtitle?: string
    weaponList: Array<string>
  }[]
}

export const CardList: FunctionComponent<CardListProps> = ({ cards }) => {
  return (
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card, index) => (
        <Card
          key={card.id ?? index}
          title={card.title}
          subtitle={card.subtitle}
          weaponList={card.weaponList}
        />
      ))}
    </div>
  )
}
