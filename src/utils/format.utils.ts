import { UserData } from '../types'

export const safeParse = (parseString: string) => {
  try {
    return JSON.parse(parseString)
  } catch (e) {
    return null
  }
}

export const getUserName = (user: UserData): string => user.username
  || `${user.first_name || ''} ${user.last_name || ''}`.trim()
  || String(user.id)
