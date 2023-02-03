import React, { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useBundlrInstance } from '@store/Bundlr'
import { connectContract } from '@utils/contracts'
import { Encryption } from '@utils/AES/encryption'
import { UploadResponse } from '@bundlr-network/client/build/common/types'
import AuthConnectButton from '@modules/AuthConnectButton'

const UploadData: React.FC = () => {
  const {
    register,
    handleSubmit: withForm,
    formState: { errors },
  } = useForm()
  const [hash, setHash] = useState('')

  const bundlrInstance = useBundlrInstance()

  const uploadFile = useCallback(
    async (data: string) => {
      try {
        const JSONData = JSON.stringify(data)
        const tx = await bundlrInstance?.upload(JSONData, {
          tags: [{ name: 'Content-Type', value: 'application/json' }],
        })
        return tx
      } catch (err) {
        console.log('error for uploadFile', err)
        throw new Error('error for uploadFile')
      }
    },
    [bundlrInstance]
  )

  const writeArweaveAdd = useCallback(
    async (bundlrTx: UploadResponse | undefined) => {
      if (!bundlrTx) {
        console.log('bundlrTx is undefined')
        return
      }
      try {
        const { id } = bundlrTx
        const { baseContract } = await connectContract()
        const tx = await baseContract.functions.setArweaveAddress(id)
        return tx
      } catch (err) {
        console.log('SetArweaveAddress', err)
        throw new Error('SetArweaveAddress')
      }
    },
    []
  )

  const handleSubmit = useCallback(
    withForm(async (data) => {
      try {
        const { lists, password } = data
        const encrypted = Encryption.encrypt(lists, password)
        console.log('encryptedData', encrypted)
        const tx = await uploadFile(encrypted)
        console.log(tx)
        const ftx = await writeArweaveAdd(tx)
        console.log('ftx', ftx)
        setHash(ftx.hash)
        alert(`sucessfully stored on arweave and blockchain, hash: ${ftx.hash}`)
      } catch (err) {
        alert('something went wrong')
      }
    }),
    [bundlrInstance]
  )
  // TODO: add error notification
  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-[14px] flex flex-col">
        <label htmlFor="lists">
          Please enter you email list(Please, separate each item with semicolon)
        </label>
        <p className="mb-2">Data format: Name Email</p>
        <textarea
          placeholder="timtimtim@deletter.com;"
          rows={4}
          id="lists"
          {...register('lists', { required: true })}
          className="border-2"
        />
        {errors.lists && (
          <div className="text-red-500">This field is required</div>
        )}
      </div>
      <div className="mb-[14px] flex flex-col">
        <label className=" text-lg" htmlFor="password">
          Set your password:{' '}
        </label>
        <input
          type="password"
          id="password"
          {...register('password', { required: true })}
          className="border-2"
        />
        {errors.password && (
          <div className="text-red-500">This field is required</div>
        )}
      </div>
      <p className="mb-[14px]">
        Already entered all the email data and is quite aware of the password?
        Then it&apos;s time to encrypt these data and store in Arweave!
      </p>
      <AuthConnectButton>
        <button className="w-full border-2 border-black p-2 items-center rounded-md hover:bg-black hover:text-white transition duration-300">
          Encrypt and Store
        </button>
      </AuthConnectButton>
      <h3 className="text-lg font-bold">Hash : </h3>
      {hash && <p className="text-green-500 break-all">{hash}</p>}
    </form>
  )
}

export default UploadData
