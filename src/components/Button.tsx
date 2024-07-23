import { h, FunctionComponent } from 'preact'

type ButtonProps = {
  text: string
  onClick: () => void
}

export const Button: FunctionComponent<ButtonProps> = ({ text, onClick }) => {
  return (
    <button
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      onClick={onClick}
    >
      {text}
    </button>
  )
}
