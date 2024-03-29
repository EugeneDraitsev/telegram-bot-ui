export type DailyUserData = {
  id: number
  is_bot: boolean
  messages: number
  last_name?: string
  first_name?: string
  username?: string
  language_code?: string
}

interface Photo {
  big_file_unique_id: string
  big_file_id: string
  small_file_id: string
  small_file_unique_id: string
}

export type Chat = {
  id: number
  type: 'private' | 'group' | 'supergroup' | 'channel'
  title?: string
  username?: string
  first_name?: string
  last_name?: string
  all_members_are_administrators?: boolean
  photo?: Photo
  description?: string
  invite_link?: string
  pinned_message?: any
  sticker_set_name?: string
  can_set_sticker_set?: boolean
}

export type HistoricalData = {
  id: number
  msgCount: number
  username: string
}
