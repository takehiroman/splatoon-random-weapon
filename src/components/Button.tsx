import { h, FunctionComponent } from 'preact'

type ButtonProps = {
  text: string
  onClick: () => void
  disabled?: boolean
}

export const Button: FunctionComponent<ButtonProps> = ({
  text,
  onClick,
  disabled = false,
}) => {
  return (
    <button
      class="flex p-2 rounded-lg bg-blue-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={disabled}
      onClick={onClick}
    >
      {text}
    </button>
  )
}
