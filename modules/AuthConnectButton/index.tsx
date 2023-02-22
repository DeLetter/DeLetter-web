import React, { type PropsWithChildren, useCallback } from 'react'
import {
  useAccount,
  useConnect,
  useChainId,
  networkRefresher,
  useSwitchNetwork,
} from '@services/Account'
import { useBundlrInstance, useInitializedBundlr } from '@services/Bundlr'
import { GOERLI_CHAINID } from '@utils/constants'
import Button from '@components/Button'

type PropsWithOnClick = PropsWithChildren<{
  onClick?: () => void
  className?: string
}>

const AuthConnectButton: React.FC<PropsWithOnClick> = ({
  onClick,
  children,
  className,
  ...props
}) => {
  const account = useAccount()
  const chainId = useChainId()
  const chainMatch = chainId === GOERLI_CHAINID
  const connect = useConnect()
  const switchNetwork = useSwitchNetwork()
  const bundlr = useBundlrInstance()
  const initializeBundlr = useInitializedBundlr()

  const handleClick = useCallback<React.MouseEventHandler<HTMLButtonElement>>(
    async (e) => {
      e.preventDefault()
      if (!account) {
        await connect()
      } else if (!!account && !chainMatch) {
        await switchNetwork(5)
        await networkRefresher()
      } else {
        await initializeBundlr()
      }
    },
    [account, chainMatch, connect, initializeBundlr, switchNetwork]
  )

  if (!account || !chainMatch || !bundlr) {
    return (
      <Button
        onClick={handleClick}
        {...props}
        text={
          !account
            ? 'Connect to Arweave'
            : !chainMatch
            ? 'Switch to Goerli'
            : 'Initialize Bundlr'
        }
      />
    )
  } else {
    return children as React.ReactElement
  }
}

export default AuthConnectButton
