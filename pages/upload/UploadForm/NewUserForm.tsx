import { useForm } from 'react-hook-form'
import { useUploadBundlr } from '@services/Bundlr'
import AuthConnectButton from '@modules/AuthConnectButton'

const NewUserForm = () => {
  //   const {
  //     register,
  //     handleSubmit: withForm,
  //     formState: { errors },
  //     setValue,
  //     getValues,
  //   } = useForm()
  //   return (
  //     <form onSubmit={handleSubmit}>
  //       <div className="mb-[14px] flex flex-col">
  //         <label htmlFor="lists">
  //           Please enter you email list(Please, separate each item with semicolon)
  //         </label>
  //         <p className="mb-2">Data format: Name Email</p>
  //         <textarea
  //           placeholder="timtimtim@deletter.com;"
  //           rows={4}
  //           id="lists"
  //           {...register('lists', { required: true })}
  //           className="border-2"
  //           value={lists}
  //         />
  //         {errors.lists && (
  //           <div className="text-red-500">This field is required</div>
  //         )}
  //       </div>
  //       <div className="mb-[14px] flex flex-col">
  //         <label className=" text-lg" htmlFor="password">
  //           Set your password:{' '}
  //         </label>
  //         <input
  //           type="password"
  //           id="password"
  //           {...register('password', {
  //             required: true,
  //           })}
  //           className="border-2"
  //         />
  //         {errors.password?.type === 'required' && (
  //           <div className="text-red-500">This field is required</div>
  //         )}
  //         {errors.password?.type === 'validate' && (
  //           <div className="text-red-500">Incorrect password</div>
  //         )}
  //       </div>
  //       <p className="mb-[14px]">
  //         Already entered all the email data and is quite aware of the password?
  //         Then it&apos;s time to encrypt these data and store in Arweave!
  //       </p>
  //       <AuthConnectButton>
  //         {hasEmailList ? 'Encrypt and Update' : 'Encrypt and Store'}
  //       </AuthConnectButton>
  //       <h3 className="text-lg font-bold">Hash : </h3>
  //       {hash && <p className="text-green-500 break-all">{hash}</p>}
  //     </form>
  //   )
}

export default NewUserForm
