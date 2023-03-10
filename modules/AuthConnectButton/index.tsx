import React, { useEffect, type PropsWithChildren, useCallback } from 'react'
import cx from 'clsx'
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
import useInTranscation from '@hooks/useInTransaction'

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
  const _connect = useConnect()
  const { inTransaction, execTransaction: connect } = useInTranscation(_connect)
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
        className={cx(
          className,
          inTransaction && 'pointer-events-none opacity-30',
          'flex flex-row justify-center items-center'
        )}
        onClick={handleClick}
        {...props}
      >
        <>
          {!account
            ? 'Connect to Arweave'
            : !chainMatch
            ? 'Switch to Goerli'
            : 'Initialize Bundlr'}
        </>
      </Button>
    )
  } else {
    return children as React.ReactElement
  }
}

export default AuthConnectButton
