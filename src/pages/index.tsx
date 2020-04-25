import React from 'react'
import styled from 'styled-components'
import { Search } from 'react-feather'

import { Input } from '../components'

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
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

export default () => (
  <Wrapper>
    <Content>
      <div>Hi, I&apos;m a Telegram chat bot.</div>
      <div>
        If you already added bot to your chat, then try to find chat by name
        or just invoke <Command>/s</Command> command in the telegram chat.
      </div>
      <SearchInput icon={<Search size={22} />} />
    </Content>
  </Wrapper>
)
