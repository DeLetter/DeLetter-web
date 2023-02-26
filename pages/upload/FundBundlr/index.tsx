import React, { useCallback, useEffect } from 'react'
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary'
import cx from 'clsx'
import AuthConnectButton from '@modules/AuthConnectButton'
import Button from '@components/Button'
import {
  useBundlrBalance,
  useFetchBundlrBalance,
  useFundBundlr,
} from '@services/Bundlr'
import useInTranscation from '@hooks/useInTransaction'

const FundBundlr: React.FC = () => {
  const balance = useBundlrBalance()
  const fetchBalance = useFetchBundlrBalance()
  const fundBundlr = useFundBundlr()

  //TODO: to be perfected
  const _fundWallet = useCallback(async () => {
    try {
      await fundBundlr()
      await fetchBalance()
    } catch (err) {
      console.log(err)
      alert('something went wrong')
    }
  }, [fundBundlr, fetchBalance])

  const { inTransaction, execTransaction: fundWallet } =
    useInTranscation(_fundWallet)

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
        <Button
          className={cx(
            inTransaction && 'pointer-events-none opacity-30',
            'flex flex-row justify-center items-center'
          )}
          onClick={fundWallet}
        >
          Fund 0.1 goerli eth in Wallet
        </Button>
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
