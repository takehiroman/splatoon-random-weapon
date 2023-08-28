import { h, FunctionComponent } from 'preact'

type ButtonProps = {
  text: string
  onClick: () => void
}

export const Button: FunctionComponent<ButtonProps> = ({ text, onClick }) => {
  return (
    <button
      class="flex p-2 rounded-lg bg-blue-500 text-white"
      onClick={onClick}
    >
      {text}
    </button>
  )
}
