import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useUploadBundlr } from '@services/Bundlr'
import { connectContract } from '@utils/contracts'
import { Encryption } from '@utils/AES/encryption'
import { UploadResponse } from '@bundlr-network/client/build/common/types'
import AuthConnectButton from '@modules/AuthConnectButton'
import { useAccount, useConnect } from '@services/Account'
import Button from '@components/Button'
import { getAddress } from '@services/readAreave'

const UploadForm: React.FC = () => {
  const {
    register,
    handleSubmit: withForm,
    formState: { errors },
    setValue,
    getValues,
  } = useForm()
  const [hash, setHash] = useState('')
  const [hasEmailList, setHasEmailList] = useState(false)
  const [lists, setLists] = useState<string>('')

  const uploadBundlr = useUploadBundlr()
  const account = useAccount()
  const connect = useConnect()

  const checkArweaveRecord = useCallback(async (address: string) => {
    const { baseContract } = await connectContract()
    const emailList = await baseContract.functions._addressList(address)
    console.log('emailList', emailList)
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

  const handleUpdate = useCallback(
    withForm(async (data) => {
      try {
        const { lists, password } = data
        const encrypted = Encryption.encrypt(lists, password)
        console.log('encryptedData', encrypted)
        const tx = await uploadBundlr(encrypted)
        console.log(tx)
        const ftx = await updateArweaveAdd(tx)
        console.log('ftx', ftx)
        setHash(ftx.hash)
        alert(`sucessfully stored on arweave and blockchain, hash: ${ftx.hash}`)
      } catch (err) {
        alert(`something went wrong: ${err}`)
      }
    }),
    [uploadBundlr]
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

  useEffect(() => {
    const check = async () => {
      if (!account) {
        await connect()
      }
      const emailList = await checkArweaveRecord(account)
      console.log('emailList', emailList)
      console.log(emailList[1])
      if (emailList.length > 0) {
        setHasEmailList(true)
        let arId = await getAddress()
        console.log('arId', arId)
        if (!arId) {
          console.log('arId is undefined, please retry')
          //TODO: temarary solution, need to improve
          arId = await getAddress()
          if (!arId) return
        }
        const res = await fetch(`https://arweave.net/${arId}`)

        const arweaveRes = await res.json()
        console.log('arweaveRes', arweaveRes)
        console.log('enteredpassword', getValues('password'))
        const decryptedData = await Encryption.decrypt(
          arweaveRes,
          getValues('password')
        )
        setLists(decryptedData)
        setValue('lists', decryptedData)
      }
    }
    check()
  }, [account, checkArweaveRecord, connect, getValues, setValue])

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
          value={lists}
          onChange={(e) => {
            setValue('lists', e.target.value)
            if (hasEmailList) {
              console.log('update')
            }
          }}
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
          {...register('password', {
            required: true,
          })}
          className="border-2"
          onChange={(e) => {
            setValue('password', e.target.value)
            if (hasEmailList) {
              console.log('update')
            }
          }}
        />
        {errors.password?.type === 'required' && (
          <div className="text-red-500">This field is required</div>
        )}
        {errors.password?.type === 'validate' && (
          <div className="text-red-500">Incorrect password</div>
        )}
      </div>
      <p className="mb-[14px]">
        Already entered all the email data and is quite aware of the password?
        Then it&apos;s time to encrypt these data and store in Arweave!
      </p>
      <AuthConnectButton>
        <Button>
          {hasEmailList ? 'Encrypt and Update' : 'Encrypt and Store'}
        </Button>
      </AuthConnectButton>
      <h3 className="text-lg font-bold">Hash : </h3>
      {hash && <p className="text-green-500 break-all">{hash}</p>}
    </form>
  )
}

export default UploadForm
