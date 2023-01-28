import { useCallback } from 'react'
import { BigNumber } from 'ethers'
import {
  useBundlrInstance,
  useBundlrBalance,
  useFetchBundlrBalance,
} from '@store/Bundlr'
import WarningBoard from '@modules/Warning'
import AuthConnectButton from '@modules/AuthConnectButton'
import UploadData from './UploadData'

export default function Upload() {
  const bundlrInstance = useBundlrInstance()
  const balance = useBundlrBalance()
  const fetchBalance = useFetchBundlrBalance()

  const fundWallet = useCallback(async () => {
    try {
      let amount = parseIntToEther(1)
      amount = amount.div(10)
      const response = await bundlrInstance?.fund(amount.toString())
      console.log('Wallet funded: ', response)
      fetchBalance()
    } catch (err) {
      console.log(err)
      alert('something went wrong')
    }
  }, [bundlrInstance, fetchBalance])

  function parseIntToEther(amount: number) {
    const conv = BigNumber.from(amount).mul(
      bundlrInstance!.currencyConfig.base[1].toString()
    )
    return conv
  }

  return (
    <>
      <div className="w-4/5">
        <WarningBoard />
        <ul>
          <li>
            Please first have a metamask, then change the net to goerli network
          </li>
          <li>If you don&apos;t have funds on bundlr,please fund first</li>
          {/* <li>
            Enter your contacts&apos; emails and then enter a password used to
            encrypt your contacts&apos; emails data
          </li>
          <li>
            When retrieving your data, please enter your password used for
            encryption first, then click `Load my data` button.{' '}
          </li>
          <li>
            Click `Send Emails` button, then it will trigger the default email
            client application in your laptop.
          </li> */}
        </ul>
        <div className="mt-[24px]">
          <h3>Balance: {balance}</h3>
          <AuthConnectButton>
            <button
              className="w-full border-2 border-black p-2 items-center rounded-md hover:bg-black hover:text-white transition duration-300"
              onClick={fundWallet}
            >
              Fund 0.1 goerli eth in Wallet
            </button>
          </AuthConnectButton>
          <UploadData />
        </div>
      </div>
    </>
  )
}
