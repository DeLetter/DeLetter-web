import React, { useCallback } from 'react'
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary'
import AuthConnectButton from '@modules/AuthConnectButton'
import Button from '@components/Button'
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
        <Button onClick={fundWallet}>Fund 0.1 goerli eth in Wallet</Button>
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
