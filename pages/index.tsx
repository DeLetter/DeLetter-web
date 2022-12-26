import Head from 'next/head'
import bundlr from 'utili/bundlr-basics'
import { Email } from '@pages/email/types/email.interface'

export default function Home() {

  const makeArweave = async (data: Email) => {
    const JSONData = JSON.stringify(data)
    const tx = await bundlr.upload(JSONData, {
      tags: [{ name: 'Content-Type', value: 'application/json' }],
    })
    console.log(tx)
    return tx
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
        <div className='text-3xl font-bold underline'>
          123
        </div>
      </main>
    </>
  )
}
