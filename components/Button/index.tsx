import React, { MouseEventHandler, ReactNode } from 'react'
import cx from 'clsx'

type ButtonProps = {
  text?: string
  className?: string
  onClick?: MouseEventHandler<HTMLButtonElement>
  children?: ReactNode
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  text,
  children,
  className,
}) => {
  return (
    <button
      onClick={onClick}
      className={cx(
        className,
        'w-full border-2 border-black p-2 items-center rounded-md hover:bg-black hover:text-white transition duration-300'
      )}
    >
      {text || children}
    </button>
  )
}
export default Button
