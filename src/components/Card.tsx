import { h, FunctionComponent } from 'preact'

type CardProps = {
  title: string
  description: string
}

export const Card: FunctionComponent<CardProps> = ({ title, description }) => {
  return (
    <div class="bg-white shadow-lg rounded-lg overflow-hidden">
      <div class="bg-gray-200 text-gray-600 text-lg font-bold p-2">{title}</div>
      <div class="p-2">
        <p class="text-gray-600">{description}</p>
      </div>
    </div>
  )
}
