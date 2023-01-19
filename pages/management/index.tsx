import { useCallback } from 'react'
import Head from 'next/head'
import { BigNumber } from 'ethers'
import { bundlrStore } from '@store/Bundlr'
import UploadData from '@modules/UploadData'
import LoadData from '@modules/LoadData'

export default function Home() {
  const bundlrInstance = bundlrStore((state) => state.bundlrInstance)
  const balance = bundlrStore((state) => state.balance)
  const fetchBalance = bundlrStore((state) => state.fetchBalance)

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
      <main className="flex flex-col items-center">
        <div className="w-4/5">
          <div className="m-3 w-full flex justify-center bg-grey-100">
            <div className="font-bold text-[16px] bg-gray-200 p-5 text-red-500">
              DeLetter's still developing. Many errors may occur, please pay
              attention to your metamask transaction status and console!
              <div className="text-center">
                For any bug please use this form: <br />
                <a
                  href="https://forms.gle/qPwTjT4RLDqoGMJ49"
                  target="_blank"
                  rel="noreferrer"
                >
                  Bug Reporting
                </a>
              </div>
            </div>
          </div>
          <ul>
            <li>
              Please first have a metamask, then change the net to goerli
              network
            </li>
            <li>If you don't have funds on bundlr,please fund first</li>
            <li>
              Enter your contacts’ emails and then enter a password used to
              encrypt your contacts’ emails data
            </li>
            <li>
              When retrieving your data, please enter your password used for
              encryption first, then click `Load my data` button.{' '}
            </li>
            <li>
              Click `Send Emails` button, then it will trigger the default email
              client application in your laptop.
            </li>
          </ul>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[10px] mt-[24px]">
            <div>
              <h3>Balance: {balance}</h3>
              <button
                className="w-full border-2 border-black p-2 items-center rounded-md hover:bg-black hover:text-white transition duration-300"
                onClick={fundWallet}
              >
                Fund 0.1 goerli eth in Wallet
              </button>
              <UploadData />
            </div>
            <LoadData />
          </div>
        </div>
      </main>
    </>
  )
}
