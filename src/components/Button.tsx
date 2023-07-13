import {h, FunctionComponent } from 'preact'

type ButtonProps={
    text: string
    onClick: () => void
}

export const Button: FunctionComponent<ButtonProps>=({text, onClick}) => {
    return (
        <button onClick={onClick}>{text}</button>
    )
}
    