import Image from 'next/image'
import Link from 'next/link'
import Cover from '../public/cover.webp'

export default function Home() {

  return (
    <div className='flex flex-col justify-center items-center h-full'>
      <Image src={Cover} alt='background image' className='absolute w-full h-full z-[-1] opacity-50' />
      <div className='flex flex-col justify-center w-[60%] z-10'>
        <p className='text-center font-semibold text-[28px] leading-[36px]'>Manage your contacts' email lists, and really own the data</p>
        <p className='text-center mt-[14px] text-[16px]'>A decentralized email lists management tool, which ensure your ownership and privacy with blockchain,decentralized storage and cryptography technology</p>
        <Link href='/management' className='p-2 mt-[14px] border-2 border-black hover:bg-[#000000] hover:text-[#ffffff] text-center rounded-md'>Start manage </Link>
      </div>
    </div>
  )
}
