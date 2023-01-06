import { useCallback } from 'react'
import Head from 'next/head'
import { BigNumber } from 'ethers'
import { useBundlr } from '@hooks/BundlrContext'
import WriteArButton from '@modules/WriteArButton'
import ReadArButton from '@modules/ReadArButton'


export default function Home() {
  const { bundlrInstance, balance, fetchBalance } = useBundlr()

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
    const conv = (BigNumber.from(amount)).mul(bundlrInstance!.currencyConfig.base[1].toString())
    return conv
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
          <WriteArButton />
          <ReadArButton />
        </div>
      </main>
    </>
  )
}
