import React from 'react'

type ButtonProps = {
  text: string
  onClick?: () => void
  children?: React.ReactNode
}

const Button: React.FC<ButtonProps> = ({ onClick, text, children }) => {
  return (
    <button
      onClick={onClick}
      className="w-full border-2 border-black p-2 items-center rounded-md hover:bg-black hover:text-white transition duration-300"
    >
      {text}
    </button>
  )
}
export default Button
