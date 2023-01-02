import '../styles/globals.css'
import type { AppProps } from 'next/app'
import BundlrContextProvider from '@hooks/BundlrContext'

export default function App({ Component, pageProps }: AppProps) {

  return (
    <BundlrContextProvider>
      <Component {...pageProps} />
    </BundlrContextProvider>
  )
}
