export interface AdminIdentity {
  id: string
  name?: string
  username?: string
  picture?: string
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
  admin: AdminIdentity
  chats: AdminChatRecord[]
}

export interface AdminSessionResponse {
  token: string
  expiresIn: number
  admin: AdminIdentity
}

export interface AdminChatPatch {
  chatId: string
  version: number
  aiAllowed?: boolean
  agenticEnabled?: boolean
}

export type AdminChatUpdateResult =
  | { ok: true; configuration: ChatConfiguration }
  | { ok: false; error: string }
