import React, { type PropsWithChildren, useCallback } from 'react'
import {
  useAccount,
  useConnect,
  useChainId,
  networkRefresher,
} from '@services/Account'
import { useBundlrInstance, useInitializedBundlr } from '@services/Bundlr'
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
  }, [account, chainMatch, connect, initializeBundlr])

  if (!account || !chainMatch || !bundlr) {
    return (
      <button
        className="w-full border-2 border-black p-2 items-center rounded-md hover:bg-black hover:text-white transition duration-300"
        onClick={handleClick}
        {...props}
      >
        {!account && 'Connect'}
        {!!account && !chainMatch && 'Switch network to Goerli'}
        {!!account && chainMatch && !bundlr && 'Initialize Bundlr'}
      </button>
    )
import React, { type PropsWithChildren } from 'react'
import { useInitializedBundlr } from '@services/Bundlr'
import Button from '@components/button'
import { useWalletConnectStore, useAccount } from '@services/WalletConnecti'

const AuthConnectButton: React.FC<PropsWithChildren> = ({
  children,
  ...props
}) => {
  const account = useAccount()
  console.log('account', account)
  //need to make sure that the wallet is initialized before we can use it
  const initializedWallet = useWalletConnectStore()
  
  const initializedBundlr = useInitializedBundlr()

  const sliceAddress = (address: string) => {
    return address.slice(0, 5) + '...' + address.slice(-5)
  }

  if (!account) {
    return (
      <Button
        text="Connect to Arweave"
        onClick={() => {
          initializedWallet()
          initializedBundlr()
        }}
        {...props}
      />
    )
  }
  if (children) {
    return <>{children}</>
  } else {
    return <Button text={sliceAddress(account)} />
  }
}

export default AuthConnectButton
export default AuthConnectButton
