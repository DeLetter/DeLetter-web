import React, { useEffect, useState, type PropsWithChildren } from 'react'
import { useAccount, useInitializedBundlr } from '@store/Bundlr'
import { providers } from 'ethers'
import { switchNetwork } from '@store/Bundlr'

const AuthConnectButton: React.FC<PropsWithChildren> = ({
  children,
  ...props
}) => {
  const [network, setNetwork] = useState<null | boolean>(false)
  const account = useAccount()
  const initializedBundlr = useInitializedBundlr()


  

  useEffect(() => {
    if (account) {
      const provider = new providers.Web3Provider(window.ethereum)
      provider.getNetwork().then((network) => {
        if (network.name === 'goerli') {
          setNetwork(true)
        }
      })
    }
  }, [account])

  if (!account) {
    return (
      <button
        className="w-full border-2 border-black p-2 items-center rounded-md hover:bg-black hover:text-white transition duration-300"
        onClick={initializedBundlr}
        {...props}
      >
        Connect
      </button>
    )
  }
  if (!network) {
    return (
      <button
        className="w-full border-2 border-black p-2 items-center rounded-md hover:bg-black hover:text-white transition duration-300"
        onClick={(e: any) => switchNetwork()}
        {...props}
      >
        Switch to Goerli
      </button>
    )
  }
  return <>{children}</>
}

export default AuthConnectButton
