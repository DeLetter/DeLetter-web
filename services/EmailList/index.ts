import { create } from 'zustand'
import { EmailInfo } from '@/types/email'
import { htmlToMarkdown } from '@utils/Parser'
import { fetchApi } from '@utils/fetch/fetchApi'
export interface SendEmail {
  emailTo: string
  emailSubject: string
  emailBody: string
}
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

export const handleSendingEmail = async ({
  emailTo,
  emailSubject,
  emailBody,
}: SendEmail) => {
  const markdownEmail = htmlToMarkdown(emailBody)
  try {
    const res = await fetchApi({
      path: 'sendEmail',
      method: 'POST',
      params: {
        emailTo: emailTo,
        emailSubject: emailSubject,
        markdownEmail: markdownEmail,
      },
    })
    
  } catch (err) {
    console.log(err)
  }
}
