export interface SessionIdentity {
  id: string
  name?: string
  username?: string
  picture?: string
}

export interface SessionUser extends SessionIdentity {
  isAdmin: boolean
}

export interface ChatConfiguration {
  chatId: string
  aiAllowed: boolean
  agenticEnabled: boolean
  version: number
  allowUpdatedAt?: number
  allowUpdatedBy?: number
  toggledAt?: number
  toggledBy?: number
}

export interface AdminChatRecord extends ChatConfiguration {
  configured: boolean
  name: string
  username?: string
  type?: string
  lastActivityAt?: number
}

export interface AdminChatsResponse {
  admin: SessionIdentity
  chats: AdminChatRecord[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
  summary: {
    total: number
    allowed: number
    enabled: number
  }
  query: AdminChatListOptions
}

export type AdminChatSortKey = 'name' | 'lastActivityAt' | 'aiAccess' | 'agent'
export type SortDirection = 'asc' | 'desc'
export type AiAccessFilter = 'all' | 'allowed' | 'blocked'

export interface AdminChatListOptions {
  page?: number
  pageSize?: number
  q?: string
  aiAccess?: AiAccessFilter
  sort?: AdminChatSortKey
  direction?: SortDirection
}

export interface SessionResponse {
  token: string
  expiresIn: number
  user: SessionUser
}

export interface UserChatRecord {
  chatId: string
  name: string
  username?: string
  type?: string
  lastActivityAt?: number
  messageCount: number
}

export interface UserChatsResponse {
  user: SessionUser
  chats: UserChatRecord[]
}

export interface ChatAccessResponse {
  chatId: string
  accessToken: string
  expiresIn: number
}

export interface AdminChatPatch {
  chatId: string
  version: number
  aiAllowed?: boolean
  agenticEnabled?: boolean
}

export type AdminChatUpdateResult =
  | { ok: true; configuration: ChatConfiguration }
  | { ok: false; error: string; conflict?: boolean }
