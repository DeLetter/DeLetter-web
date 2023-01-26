import Image from 'next/image'
import Link from 'next/link'
import Cover from '../public/cover.webp'

export default function Home() {
  return (
    <div className="absolute top-0 flex flex-col justify-center items-center h-full w-full">
      <Image
        priority
        src={Cover}
        alt="background image"
        className="absolute w-full h-full z-[-1] opacity-50 select-none pointer-events-none"
        draggable={false}
      />
      <div className="flex flex-col justify-center w-[60%] z-10">
        <p className="text-center font-semibold text-[28px] leading-[36px]">
          Manage your contacts&apos; email lists, and really own the data
        </p>
        <p className="text-center mt-[14px] text-[16px]">
          A decentralized email lists management tool, which ensure your
          ownership and privacy with blockchain,decentralized storage and
          cryptography technology
        </p>
        <div className="flex flex-row justify-around items-center">
          <Link
            href="/upload"
            className="p-2 mt-[14px] border-2 border-black rounded-md hover:bg-[#000000] hover:text-[#ffffff] text-center transition duration-300"
          >
            Upload and manage{' '}
          </Link>
          <Link
            href="/download"
            className="ml-[10px] p-2 mt-[14px] border-2 border-black rounded-md hover:bg-[#000000] hover:text-[#ffffff] text-center transition duration-300"
          >
            Download and contact{' '}
          </Link>
        </div>
      </div>
    </div>
  )
}
