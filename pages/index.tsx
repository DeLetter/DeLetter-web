import { useCallback, useContext, useState } from 'react'
import Head from 'next/head'
// import bundlr from '@utils/bundlr/bundlr-basics'
import * as Bignumber from 'bignumber.js'
import { MainContext } from '@utils/context'
// import { BigNumber } from 'ethers'
// import AuthConnectButton from '@modules/AuthConnectButton'
import { Email } from '@pages/email/types/email.interface'
import { BigNumber } from 'ethers'

export default function Home() {
  const [URI, setURI] = useState('')
  const { bundlrInstance, initialBundlr, balance, fetchBalance } =
    useContext(MainContext)
  async function initBunder() {
    await initialBundlr()
  }
  const fundWallet = useCallback(async () => {
    try {
      let amount = parseIntToEther(0.01)
      const response = await bundlrInstance?.fund(amount)
      console.log('Wallet funded: ', response)
      fetchBalance()
    } catch (err) {
      console.log(err)
      alert('something went wrong')
    }
  }, [bundlrInstance, fetchBalance])

  function parseIntToEther(amount: number) {
    const conv = new Bignumber.BigNumber(amount).multipliedBy(bundlrInstance!.currencyConfig.base[1])
    return conv
  }

  const uploadFile = useCallback(async (data: Email) => {
    const JSONData = JSON.stringify(data)
    const tx = await bundlrInstance?.upload(JSONData, {
      tags: [{ name: 'Content-Type', value: 'application/json' }],
    })
    console.log(tx)
    return tx
  }, [bundlrInstance])

  const makeArweave = async (data: Email) => {
    try {
      const tx = await uploadFile(data)
      console.log('tx: ', tx)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setURI(`${(tx as any).id}`)
    } catch (err) {
      console.log('error for initialize bundlr', err)
      alert('something went wrong')
    }
  }

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {!balance && <button onClick={initBunder}>Initialize</button>}
        {balance && (
          <div className="flex flex-col items-center">
            <h1>
              Many errors may occur, please pay attention to your metamask
              transaction status and console
            </h1>
            <h2>
              Please first have a metamask, then change the net to goerli
              network
            </h2>
            <h2 className="w-4/5 text-center">
              If you don&apos;t have funds on bundlr,please fund first, then
              click the store on arweave button, a static data will be sent to
              arweave network
            </h2>
            <h3>Balance: {balance}</h3>
            <button className="border-2 border-black" onClick={fundWallet}>
              Fund 0.1 goerli eth in Wallet
            </button>
            <button
              className="border-2 border-black"
              onClick={() =>
                makeArweave({
                  from: 'tim',
                  to: 'joe',
                  subject: 'hello',
                  body: 'hello world',
                })
              }
            >
              Store on Arweave!
            </button>
            {URI && <span>id on bundlr devnet :{URI}</span>}
          </div>
        )}
      </main>
    </>
  )
}
