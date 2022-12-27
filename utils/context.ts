//TODO: This is a temparary file, it'll be deleted
import { createContext } from 'react'
import { WebBundlr } from '@bundlr-network/client'

export interface IMainContext {
  initialBundlr: () => Promise<void> | void
  bundlrInstance: WebBundlr | undefined | null
  balance: string
  fetchBalance: () => Promise<void> | void
}

const MainContextDefault = {
  initialBundlr: () => undefined,
  bundlrInstance: undefined,
  balance: '',
  fetchBalance: () => undefined,
}
export const MainContext = createContext<IMainContext>(MainContextDefault)