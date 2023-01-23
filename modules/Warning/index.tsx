import React from "react";

const WarningBoard: React.FC = () => {
  return (
    <div className="m-3 w-full flex justify-center bg-grey-100">
      <div className="font-bold text-[16px] bg-gray-200 p-5 text-red-500">
        DeLetter&apos;s still developing. Many errors may occur, please
        pay attention to your metamask transaction status and console!
        <div className="text-center">
          For any bug please use this form: <br />
          <a
            href="https://forms.gle/qPwTjT4RLDqoGMJ49"
            target="_blank"
            rel="noreferrer"
          >
            Bug Reporting
          </a>
        </div>
      </div>
    </div>
  )
}

export default WarningBoard;