import { BigNumber } from 'ethers'
import {
  useBundlrInstance,
  useBundlrBalance,
  useFetchBundlrBalance,
} from '@store/Bundlr'
import WarningBoard from '@modules/Warning'
import FundBundlr from './FundBundlr'
import UploadData from './UploadData'

export default function Upload() {
  const bundlrInstance = useBundlrInstance()
  const balance = useBundlrBalance()
  const fetchBalance = useFetchBundlrBalance()

  function parseIntToEther(amount: number) {
    const conv = BigNumber.from(amount).mul(
      bundlrInstance!.currencyConfig.base[1].toString()
    )
    return conv
  }

  return (
    <>
      <div className="w-4/5">
        <WarningBoard />
        <ul>
          <li>
            Please first have a metamask, then change the net to goerli network
          </li>
          <li>If you don&apos;t have funds on bundlr,please fund first</li>
        </ul>
        <div className="mt-[24px]">
          <FundBundlr />
          <UploadData />
        </div>
      </div>
    </>
  )
}
