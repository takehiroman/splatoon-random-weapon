import { Logo } from './components/logo'
import {h,Fragment} from 'preact'
import { Button } from './components/Button'
export function App() {
  return (
    <>
      <Logo />
      <p>Hello Vite + Preact!</p>
      <Button text="Click me!" onClick={() => alert('Hello!')} />
    </>
  )
}
