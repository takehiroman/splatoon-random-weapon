import { h, Fragment } from 'preact'
import { Button } from './components/Button'
import { CardList } from './components/CardList'
export function App() {
  const cards = [
    {
      title: 'Preact',
      description: 'Fast 3kB alternative to React with the same modern API.',
    },
    {
      title: 'Vite',
      description: 'Native-ESM powered frontend dev server.',
    },
    {
      title: 'TypeScript',
      description: 'Typed JavaScript at Any Scale.',
    },
  ]
  const handleClick = () => {
    alert('Hello!')
  }
  return (
    <>
      <CardList cards={cards} />
      <div class="flex m-4 justify-center">
        <Button text="Click me!" onClick={handleClick} />
      </div>
    </>
  )
}
