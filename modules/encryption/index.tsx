import { Encryption } from '@utils/AES/encryption'
import { useState } from 'react'

const EncryptData: React.FC = () => {
  const [data, setData] = useState('')
  const [key, setKey] = useState('')
  const [encrypted, setEncrypted] = useState('')
  const [decrypted, setDecrypted] = useState('')

  const encrypt = () => {
    setEncrypted(Encryption.encrypt(data, key))
  }

  const decrypt = () => {
    setDecrypted(Encryption.decrypt(encrypted, key))
  }

  return (
    <>
      data
      <input
        className="border-2 border-black inline-block m-2"
        type="text"
        value={data}
        onChange={(e) => setData(e.target.value)}
      />
      key
      <input
        className="border-2 border-black inline-block m-2"
        type="text"
        value={key}
        onChange={(e) => setKey(e.target.value)}
      />
      <button className="border-2 border-black rounded m-2" onClick={encrypt}>
        Encrypt
      </button>
      <button className="border-2 border-black rounded m-2" onClick={decrypt}>
        Decrypt
      </button>
      <p>Encrypted: {encrypted}</p>
      <p>Decrypted: {decrypted}</p>
    </>
  )
}

export default EncryptData
