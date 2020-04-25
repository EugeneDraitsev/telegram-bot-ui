/* eslint-disable camelcase */
import { ChatInfo, DailyUserData } from '../types'

export const safeParse = (parseString: string) => {
  try {
    return JSON.parse(parseString)
  } catch (e) {
    return null
  }
}

export const getUserName = (user: DailyUserData | ChatInfo) => user?.username
  || `${user?.first_name || ''} ${user?.last_name || ''}`.trim()
  || String(user?.id ?? 'Unknown Chat')

export const getChatName = (chat: ChatInfo): string => chat?.title || getUserName(chat)
