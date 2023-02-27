import { create } from 'zustand'
import { EmailInfo } from '@/types/email'
export interface EmailListStore {
  emailList: string
  setEmailList: (emailInfo: EmailInfo[]) => Promise<void> | void
}

export const useEmailListStore = create<EmailListStore>((set) => ({
  emailList: '',
  setEmailList: (emailInfo: EmailInfo[]) => {
    if (!emailInfo) return
    let tempEmailList = emailInfo.map((e) => {
      return e.email
    })
    set({ emailList: tempEmailList.join('; ') })
  },
}))

export const useEmailList = () => useEmailListStore((state) => state.emailList)
export const useSetEmailList = () =>
  useEmailListStore((state) => state.setEmailList)
