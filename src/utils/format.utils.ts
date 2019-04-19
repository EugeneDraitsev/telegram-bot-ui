import { ChatInfo, UserData } from '../types'

export const safeParse = (parseString: string) => {
  try {
    return JSON.parse(parseString)
  } catch (e) {
    return null
  }
}

export const getUserName = (user: UserData) => user.username
  || `${user.first_name || ''} ${user.last_name || ''}`.trim()
  || String(user.id)


export const getChatName = (chat: ChatInfo): string => chat.title || getUserName(chat as any)
