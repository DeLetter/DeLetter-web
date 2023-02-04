import WarningBoard from '@modules/Warning'
import FundBundlr from './FundBundlr'
import UploadForm from './UploadForm'

const UploadGuides: React.FC = () => {
  return (
    <ul>
      <li>
        Please first have a metamask, then change the net to goerli network
      </li>
      <li>If you don&apos;t have funds on bundlr,please fund first</li>
    </ul>
  )
}

export default function Upload() {
  return (
    <>
      <div className="w-4/5">
        <WarningBoard />
        <UploadGuides />
        <div className="mt-[24px]">
          <FundBundlr />
          <UploadForm />
        </div>
      </div> 
    </>
  )
}
