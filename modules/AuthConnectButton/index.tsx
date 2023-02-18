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
}>

const AuthConnectButton: React.FC<PropsWithOnClick> = ({
  onClick,
  children,
  ...props
}) => {
  const account = useAccount()
  const chainId = useChainId()
  const chainMatch = chainId === GOERLI_CHAINID
  const connect = useConnect()
  const switchNetwork = useSwitchNetwork()
  const bundlr = useBundlrInstance()
  const initializeBundlr = useInitializedBundlr()

  const handleClick = useCallback<
    React.MouseEventHandler<HTMLButtonElement>
  >(async () => {
    if (!account) {
      await connect()
    } else if (!!account && !chainMatch) {
      await switchNetwork(5)
      await networkRefresher()
    } else {
      await initializeBundlr()
    }
  }, [account, chainMatch, connect, initializeBundlr, switchNetwork])

  const sliceAddress = (address: string) => {
    return address.slice(0, 5) + '...' + address.slice(-5)
  }

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
    return children ? (
      <Button onClick={onClick} {...props}>
        {children}
      </Button>
    ) : (
      <Button text={sliceAddress(account)} className={''} />
    )
  }
}

export default AuthConnectButton
