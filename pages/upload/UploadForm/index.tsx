import React, { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useUploadBundlr } from '@services/Bundlr'
import { connectContract } from '@utils/contracts'
import { Encryption } from '@utils/AES/encryption'
import { UploadResponse } from '@bundlr-network/client/build/common/types'
import AuthConnectButton from '@modules/AuthConnectButton'
import { update } from 'lodash-es'

const UploadForm: React.FC = () => {
  const {
    register,
    handleSubmit: withForm,
    formState: { errors },
  } = useForm()
  const [hash, setHash] = useState('')

  const uploadBundlr = useUploadBundlr()

  const checkArweaveRecord = useCallback(async (address: string) => {
    const { baseContract } = await connectContract()
    const emailList = await baseContract.functions._addressList(address)
    return emailList
  }, [])

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

  const updateArweaveAdd = useCallback(
    async (bundlrTx: UploadResponse | undefined) => {
      if (!bundlrTx) {
        console.log('bundlrTx is undefined')
        return
      }
      try {
        const { id } = bundlrTx
        const { baseContract } = await connectContract()
        const tx = await baseContract.functions.updateArweaveAddress(id)
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
        const tx = await uploadBundlr(encrypted)
        console.log(tx)
        const ftx = await writeArweaveAdd(tx)
        console.log('ftx', ftx)
        setHash(ftx.hash)
        alert(`sucessfully stored on arweave and blockchain, hash: ${ftx.hash}`)
      } catch (err) {
        alert(`something went wrong: ${err}`)
      }
    }),
    [uploadBundlr]
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
      <AuthConnectButton>Encrypt and Store</AuthConnectButton>
      <h3 className="text-lg font-bold">Hash : </h3>
      {hash && <p className="text-green-500 break-all">{hash}</p>}
    </form>
  )
}

export default UploadForm
