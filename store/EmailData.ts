import create from 'zustand'

export interface EmailDataStore {
  encryptedData: string
}

export const emailDataStore = create<EmailDataStore>((set, get) => ({
  encryptedData: '',
}))
