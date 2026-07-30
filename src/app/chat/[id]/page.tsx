'use client'

import { use } from 'react'
import styled from 'styled-components'

import { Card } from '@/components/card.component'
import { ChatInfo } from '@/components/chat-info.component'
import { HistoricalStatistics } from '@/components/chat/historical-statistics.component'
import { LastDayStatistics } from '@/components/chat/last-day-statistics.component'
import { Spinner } from '@/components/spinner.component'
import { useChatData } from '@/hooks/use-chat-data.hook'

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: auto;
`
const Container = styled.div`
  width: 1200px;
  max-width: 100vw;
`
const LoadingWrapper = styled(Wrapper)`
  min-height: 100vh;
`
const GraphCard = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 1200px;
  margin: 20px;
  padding: 15px 0;
  @media (max-width: 800px) {
    margin: 10px;
    max-width: calc(100vw - 20px);
  }
`
const LoadingCard = styled(GraphCard)`
  height: 506px;
`

type ChatPageProps = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ access?: string | string[] }>
}

const ChatPage = ({ params, searchParams }: ChatPageProps) => {
  const { id } = use(params)
  const { access } = use(searchParams)
  const accessToken = Array.isArray(access) ? access[0] : access
  const { loading, data, error } = useChatData(id, accessToken)
  const { chatInfo, usersData, historicalData } = data

  if (error) {
    return <LoadingWrapper>{error}</LoadingWrapper>
  }

  return (
    <>
      {!loading && <ChatInfo data={chatInfo} />}
      <Wrapper>
        {loading && (
          <Container>
            {[0, 1].map((i) => (
              <LoadingCard key={i}>
                <Spinner />
              </LoadingCard>
            ))}
          </Container>
        )}
        {!loading && (
          <Container>
            <LastDayStatistics usersData={usersData} />
            <HistoricalStatistics historicalData={historicalData || []} />
          </Container>
        )}
      </Wrapper>
    </>
  )
}

export default ChatPage
