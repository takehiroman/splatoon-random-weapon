import { h, FunctionComponent } from 'preact'
import { Card } from './Card'

type CardListProps = {
  cards: {
    title: string
    description: string
  }[]
}

export const CardList: FunctionComponent<CardListProps> = ({ cards }) => {
  return (
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card, index) => (
        <Card key={index} title={card.title} description={card.description} />
      ))}
    </div>
  )
}
