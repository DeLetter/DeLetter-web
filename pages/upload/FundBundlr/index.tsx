import React, { useCallback } from 'react'
import { ONE_ETHER } from '@utils/constants'
import AuthConnectButton from '@modules/AuthConnectButton'
import {
  useBundlrInstance,
  useBundlrBalance,
  useFetchBundlrBalance,
} from '@store/Bundlr'

const FundBundlr: React.FC = () => {
  const bundlrInstance = useBundlrInstance()
  const balance = useBundlrBalance()
  const fetchBalance = useFetchBundlrBalance()

  const fundWallet = useCallback(async () => {
    try {
      let amount = ONE_ETHER.div(10)
      const response = await bundlrInstance?.fund(amount.toString())
      console.log('Wallet funded: ', response)
      fetchBalance()
    } catch (err) {
      console.log(err)
      alert('something went wrong')
    }
  }, [bundlrInstance, fetchBalance])
  return (
    <>
      <h3>Balance: {balance}</h3>
      <AuthConnectButton>
        <button
          className="w-full border-2 border-black p-2 items-center rounded-md hover:bg-black hover:text-white transition duration-300"
          onClick={fundWallet}
        >
          Fund 0.1 goerli eth in Wallet
        </button>
      </AuthConnectButton>
    </>
  )
}

export default FundBundlr
