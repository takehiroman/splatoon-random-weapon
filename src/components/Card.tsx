import { h, FunctionComponent } from 'preact'

type CardProps = {
  title: string
  weaponList: string[]
}

export const Card: FunctionComponent<CardProps> = ({ title, weaponList }) => (
  <div class="bg-white shadow-lg rounded-lg overflow-hidden">
    <div class="bg-gray-200 text-gray-600 text-lg font-bold p-2">{title}</div>
    <ul class="text-gray-600">
      {weaponList.map((weapon, index) => (
        <li key={index} class="border-b border-gray-200 p-2">
          {weapon}
        </li>
      ))}
    </ul>
  </div>
)
