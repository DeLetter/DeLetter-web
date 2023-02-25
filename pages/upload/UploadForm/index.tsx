import React, { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import cx from 'clsx'
import { useUploadBundlr } from '@services/Bundlr'
import { connectContract } from '@utils/contracts'
import { Encryption } from '@utils/AES/encryption'
import { UploadResponse } from '@bundlr-network/client/build/common/types'
import AuthConnectButton from '@modules/AuthConnectButton'
import UpLoadCSV from '@modules/UploadCSV'
import Button from '@components/Button'
import { useAccount } from '@services/Account'

interface errType {
  message: string
}
//TODO: 1, upload instead of setting 2. retrieve the previous data before uploading the new one
const UploadForm: React.FC = () => {
  const {
    register,
    handleSubmit: withForm,
    formState: { errors },
    setValue,
  } = useForm()
  const [hash, setHash] = useState('')
  const [isCSV, setIsCSV] = useState(false)
  const account = useAccount()

  const uploadBundlr = useUploadBundlr()

  const getArweaveAdd = useCallback(async () => {
    try {
      const { baseContract } = await connectContract()
      const ArwAdd = await baseContract.functions._addressList(account)
      return ArwAdd
    } catch (err) {
      throw new Error('Read Arweave address error')
    }
  }, [])

  const uploadArweaveAdd = useCallback(
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
        throw new Error('UploadArweaveAddress')
      }
    },
    []
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
        throw new Error('SetArweaveAddress')
      }
    },
    []
  )

  const handleSubmit = useCallback(
    async (data: any) => {
      try {
        const { names, rawEmails, password } = data
        let nameList: string[] = []
        let emailList: string[] = []
        if (!isCSV) {
          nameList = names ? names.split(',') : []
          emailList = rawEmails ? rawEmails.split(',') : []
        } else {
          nameList = names
          emailList = rawEmails
        }
        let emailInfoList = nameList.map((name: string, i: number) => {
          return {
            name: name,
            email: emailList[i],
          }
        })
        const eimalInfoReady = JSON.stringify(emailInfoList)
        const encrypted = Encryption.encrypt(eimalInfoReady, password)
        console.log('encryptedData', encrypted)
        const tx = await uploadBundlr(encrypted)
        console.log(tx)
        let arwAdd = await getArweaveAdd()
        let ftx: { hash: string }
        if (!arwAdd) {
          ftx = await writeArweaveAdd(tx)
        } else {
          ftx = await uploadArweaveAdd(tx)
        }
        console.log('ftx', ftx)
        setHash(ftx.hash)
        alert(`sucessfully stored on arweave and blockchain, hash: ${ftx.hash}`)
      } catch (err) {
        console.log(err)
        alert(`something went wrong: ${err}`)
      }
    },
    [uploadBundlr, isCSV]
  )

  // TODO: add error notification
  return (
    <form onSubmit={withForm((data) => handleSubmit(data))}>
      <div className="mb-[14px] flex flex-col">
        <div className="flex flex-row justify-between">
          <span>
            Please enter you email list(Please, separate each item with comma)
          </span>
          <button
            className={cx(
              isCSV && 'underline decoration-1 text-black',
              'text-gray-400'
            )}
            onClick={(e) => {
              e.preventDefault()
              setIsCSV((pre) => {
                return !pre
              })
            }}
          >
            Use csv
          </button>
        </div>
        {!isCSV && (
          <div className="my-[14px] grid gird-rows-2 gap-4">
            <div className="grid grid-cols-2 gap-4">
              <label htmlFor="names">Please enter the name list</label>
              <input
                className="border-2"
                id="names"
                {...register('names')}
                placeholder="ricy, tim"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <label htmlFor="rawEmails">Please enter the email list</label>
              <input
                className="border-2"
                id="rawEmails"
                {...(register('rawEmails'), { required: true })}
                placeholder="ricy@deletter.com, tim@deletter.com"
              />
              {errors.rawEmails?.type === 'required' && (
                <div className="text-red-500">This field is required</div>
              )}
            </div>
          </div>
        )}
        {isCSV && (
          <UpLoadCSV
            setValue={setValue}
            register={register}
            errors={errors}
            firstLineName="names"
            secondLineName="rawEmails"
          />
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
        <Button>Encrypt and Update</Button>
      </AuthConnectButton>
      <h3 className="text-lg font-bold">Hash : </h3>
      {hash && <p className="text-green-500 break-all">{hash}</p>}
    </form>
  )
}

export default UploadForm
