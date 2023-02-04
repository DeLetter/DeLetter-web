import React, { useCallback } from 'react'
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary'
import AuthConnectButton from '@modules/AuthConnectButton'
import {
  useBundlrBalance,
  useFetchBundlrBalance,
  useFundBundlr,
} from '@services/Bundlr'

const FundBundlr: React.FC = () => {
  const balance = useBundlrBalance()
  const fetchBalance = useFetchBundlrBalance()
  const fundBundlr = useFundBundlr()

  const fundWallet = useCallback(async () => {
    try {
      await fundBundlr()
      await fetchBalance()
    } catch (err) {
      console.log(err)
      alert('something went wrong')
    }
  }, [fundBundlr, fetchBalance])
  return (
    <>
      <ErrorBoundary
        fallbackRender={(fallbackProps) => (
          <ErrorBoundaryFallback {...fallbackProps} />
        )}
      >
        <h3>Balance: {balance}</h3>
      </ErrorBoundary>
      <AuthConnectButton>
        <button
          className="w-full border-2 border-black p-2 items-center rounded-md hover:bg-black hover:text-white transition duration-300"
          onClick={fundWallet}
        >
          Fund 0.1 goerli eth in Wallet
        </button>
      </AuthConnectButton>
    </>
  )
}

const ErrorBoundaryFallback: React.FC<FallbackProps> = ({
  resetErrorBoundary,
}) => {
  return <h3>Balance: </h3>
}

export default FundBundlr