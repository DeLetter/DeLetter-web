import React, { type PropsWithChildren } from 'react'
import { useAccount, useInitializedBundlr } from '@services/Bundlr'
import { EthereumLogo, PolygonLogo } from './constant/chain-logo'
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
          <EthereumLogo width="20px" height="20px" />
          <PolygonLogo width="20px" height="20px" />
          Connect
        </button>
      </>
    )
  }
  return <>{children}</>
}

export default AuthConnectButton
