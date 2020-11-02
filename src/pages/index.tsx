import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import Link from 'next/link'
import { Search } from 'react-feather'
import { isArray, isEmpty } from 'lodash-es'

import { Button, ChatInfo, Input } from '../components'
import { config } from '../api.config'
import { Chat } from '../types'

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
`
const Content = styled.div`
  width: 500px;
  max-width: 100vw;
  padding: 20px;
`
const Command = styled.span`
  display: inline-block;
  font-weight: bold;
`
const SearchInput = styled(Input)`
  margin: 10px auto;
`
const SearchButton = styled(Button)`
  margin-left: 10px;
`
const SearchChatInfo = styled(ChatInfo)`
  margin: 10px 0;
  cursor: pointer;
`

const IndexPage = () => {
  const [chatName, setChatName] = useState('')
  const [submittedName, setSubmittedName] = useState('')
  const [chats, setChats] = useState<Chat[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onInputChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setChatName(e.currentTarget.value)
    },
    [setChatName],
  )

  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault()
      if (chatName) {
        try {
          setLoading(true)
          setError('')
          setSubmittedName(chatName)
          const url = `${config.rest}/search?name=${encodeURI(chatName)}`
          const newChats = await fetch(url).then((x) => x.json())
          setChats(newChats)
        } catch (err) {
          setError('Something went wrong. Try again later')
        } finally {
          setLoading(false)
        }
      }
    },
    [chatName, setLoading, setError],
  )

  return (
    <Wrapper>
      <Content>
        <h4>Hi, I&apos;m a Telegram chat bot.</h4>
        <p>
          If you have already added the bot to your chat, try to find the chat by name or just
          invoke <Command>/s</Command> command in telegram chat.
        </p>
        <form onSubmit={onSubmit}>
          <SearchInput
            value={chatName}
            onChange={onInputChange}
            aria-label="chat-name"
            placeholder="Chat Name"
            icon={<Search size={22} />}
          />
          <SearchButton type="submit" loading={loading}>
            Search
          </SearchButton>
        </form>
        {chats?.map((chat) => (
          <Link href={`/chat/${chat.id}`} key={chat.id}>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a>
              <SearchChatInfo data={chat} />
            </a>
          </Link>
        ))}
        {error && <p>{error}</p>}
        {isArray(chats) && isEmpty(chats) && !error && (
          <p>
            No results for chats matching <strong>{submittedName}</strong>
          </p>
        )}
      </Content>
    </Wrapper>
  )
}

export default IndexPage
