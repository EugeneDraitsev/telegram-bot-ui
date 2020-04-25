import React from 'react'
import styled from 'styled-components'

import { ChatInfo as ChatInfoType } from '../types'
import { getChatName } from '../utils'

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  background: #d6d6d6;
`
const Content = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  padding: 5px 15px;
`
const ChatImage = styled.div<{ src?: string }>`
  width: 70px;
  min-width: 70px;
  height: 70px;
  background: ${({ src }) => `url("${src}") center center no-repeat`};
  background-size: contain;
  border-radius: 50%;
  border: 2px solid white;
`
const Title = styled.div`
  margin-left: 20px;
  font-size: 24px;
  font-weight: 300;
`

const Subtitle = styled.div`
  font-size: 14px;
`

interface ChatInfoProps {
  data: ChatInfoType,
}

export const ChatInfo = ({ data }: ChatInfoProps) => (
  <Wrapper>
    <Content>
      <ChatImage src={data.photoUrl || '/favicon.png'} />
      <Title>
        {getChatName(data)}
        <Subtitle>{data.description}</Subtitle>
      </Title>
    </Content>
  </Wrapper>
)
