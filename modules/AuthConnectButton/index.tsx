import React, { type PropsWithChildren, useCallback } from 'react'
import {
  useAccount,
  useConnect,
  useChainId,
  networkRefresher,
} from '@services/Account'
import { GOERLI_CHAINID } from '@utils/constants'
import { switchNetwork } from '@utils/AccountUtils'

const AuthConnectButton: React.FC<PropsWithChildren> = ({
  children,
  ...props
}) => {
  const account = useAccount()
  const chainId = useChainId()
  const chainMatch = chainId === GOERLI_CHAINID
  const connect = useConnect()
  const handleClick = useCallback<
    React.MouseEventHandler<HTMLButtonElement>
  >(async () => {
    if (!account) {
      await connect()
    } else {
      await switchNetwork(5)
      await networkRefresher()
    }
  }, [account, chainMatch])

  if (!account || !chainMatch) {
    return (
      <button
        className="w-full border-2 border-black p-2 items-center rounded-md hover:bg-black hover:text-white transition duration-300"
        onClick={handleClick}
        {...props}
      >
        {!account && 'Connect'}
        {!!account && !chainMatch && 'Switch network to Goerli'}
      </button>
    )
  }
  return <>{children}</>
}

export default AuthConnectButton
