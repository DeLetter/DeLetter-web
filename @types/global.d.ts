import { ethers } from 'ethers'

//TODO: CHANGE PROVIDER
interface TEthereumProvider extends ethers.providers.ExternalProvider {
  chainId: string
}
declare global {
  interface Window {
    ethereum: TEthereumProvider | undefined
  }
}

declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    // extends React's HTMLAttributes
    css?: CSSProp // or Interpolation<WithTheme<{}>>
  }
}

declare module '*.svg' {
  const content: React.FC<React.SVGProps<SVGSVGElement>>
  export default content
}
