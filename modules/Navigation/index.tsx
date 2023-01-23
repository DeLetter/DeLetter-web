import React from "react";
import Link from "next/link";

const Navigation: React.FC = () => {
  return (
    <nav className="fixed top-0 flex flex-row justify-center items-center h-[64px] text-gray-500">
      <div className="w-4/5">
        <Link href="/upload">UploadData</Link>
        <Link href="/download" className="ml-[10px]">DownloadData</Link>
      </div>
    </nav>
  )
}

export default Navigation;