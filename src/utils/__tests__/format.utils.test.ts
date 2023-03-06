import { getChatName, getUserName, safeParse } from '..'
import type { Chat, DailyUserData } from '@/types'

describe('getChatName', () => {
  it('should return correct chat name, if it exists', () => {
    expect(getChatName({ title: 'Chat Name' } as Chat)).toEqual('Chat Name')
    expect(
      getChatName({ first_name: 'User', last_name: 'Name' } as Chat),
    ).toEqual('User Name')
  })
  it('should return "Unknown Chat" if name doesn\'t exist', () => {
    expect(getChatName({} as Chat)).toEqual('Unknown Chat')
    // force to use it with null
    expect(getChatName(null as any)).toEqual('Unknown Chat')
  })
})

describe('getUserName', () => {
  it('should return correct user name, if it exists', () => {
    expect(
      getUserName({ first_name: 'User', last_name: 'Name' } as DailyUserData),
    ).toEqual('User Name')
    expect(getUserName({ username: 'UserName' } as Chat)).toEqual('UserName')
  })
  it('should return "Unknown Chat" if name doesn\'t exist', () => {
    expect(getChatName({} as Chat)).toEqual('Unknown Chat')
  })
})

describe('safeParse', () => {
  it('should parse json and return parsed object', () => {
    expect(safeParse('{ "first_name": "User", "last_name": "Name" }')).toEqual({
      first_name: 'User',
      last_name: 'Name',
    })
    expect(safeParse('{}')).toEqual({})
  })
  it('should return null if JSON is not valid', () => {
    expect(safeParse('{}}')).toEqual(null)
    // force to use it with null
    expect(safeParse('$!@&#GDASD')).toEqual(null)
  })
})
