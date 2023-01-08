import * as CryptoJS from 'crypto-js'

export class Encryption {
  public static encrypt(data: string, key: string): string {
    return CryptoJS.AES.encrypt(data, key).toString()
  }

  public static decrypt(encrypted: string, key: string): string {
    return CryptoJS.AES.decrypt(encrypted, key).toString(CryptoJS.enc.Utf8)
  }
}

export default Encryption
