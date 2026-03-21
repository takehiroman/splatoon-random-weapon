import { h, FunctionComponent } from 'preact'

type CardProps = {
  title: string
  weaponList: Array<string>
  subtitle?: string
}

export const Card: FunctionComponent<CardProps> = ({
  title,
  weaponList,
  subtitle,
}) => {
  return (
    <div class="bg-white shadow-lg rounded-lg overflow-hidden">
      <div class="bg-gray-200 text-gray-600 p-3">
        <div class="text-lg font-bold">{title}</div>
        {subtitle && <div class="text-sm text-gray-500">{subtitle}</div>}
      </div>
      <ul class="text-gray-600">
        {weaponList.map((weapon, index) => (
          <li key={index} class="border-b border-gray-200 p-2">
            {weapon}
          </li>
        ))}
      </ul>
    </div>
  )
}
