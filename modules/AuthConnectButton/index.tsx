import { providers } from 'ethers';
import React, { useState, type PropsWithChildren, useCallback, useEffect } from 'react';
// import { ConnectButton } from "@rainbow-me/rainbowkit";
const ConnectButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ ...props }) => {
  const connectWallet = useCallback(async () => {
    if (!(window as any).ethereum) {
      alert('please install metamask')
    }
    await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
  }, [])
  return <button onClick={connectWallet} {...props}>Connect</button>
}

//For checking whether user is connected to the website, if connected, then render the children, if not, show connect button
const AuthConnectButton: React.FC<PropsWithChildren> = ({ children, ...props }) => {
  const [isConnected, setIsConnected] = useState(false);
  const checkConnection = useCallback(async () => {
    try {
      const accounts = await (window as any).ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        setIsConnected(true)
      }
    } catch (err) {
      console.log(err)
      alert('something went wrong')
    }
  }, [])

  useEffect(() => {
    checkConnection();
  }, []);
  if (isConnected) return children as React.ReactElement;
  return <ConnectButton {...props} />
}

export default AuthConnectButton;