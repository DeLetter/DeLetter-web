import React, { type PropsWithChildren } from 'react'
import { useAccount, useInitializedBundlr } from '@services/Bundlr'
import { EthereumLogo } from './constant/networkLogo'
import Image from 'next/image'

const AuthConnectButton: React.FC<PropsWithChildren> = ({
  children,
  ...props
}) => {
  const account = useAccount()
  const initializedBundlr = useInitializedBundlr()

  if (!account) {
    return (
      <>
        <button
          className="w-full border-2 border-black p-2 items-center rounded-md hover:bg-black hover:text-white transition duration-300"
          onClick={initializedBundlr}
          {...props}
        >
          <EthereumLogo />
          Connect
        </button>
      </>
    )
  }
  return <>{children}</>
}

export default AuthConnectButton
