'use client'

import styled from 'styled-components'

import { ChatInfo } from '@/components/chat-info.component'
import { HistoricalStatistics } from '@/components/chat/historical-statistics.component'
import { LastDayStatistics } from '@/components/chat/last-day-statistics.component'
import { MessageVolume } from '@/components/chat/message-volume.component'
import { StatisticsSkeleton } from '@/components/chat/statistics-skeleton.component'
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
const ErrorWrapper = styled(Wrapper)`
  min-height: 100vh;
`

export function ChatDashboard({
  chatId,
  accessToken,
  hasPhoto,
  memberCount,
}: {
  chatId: string
  accessToken: string
  hasPhoto?: boolean
  memberCount?: number
}) {
  const { loading, data, error } = useChatData(chatId, accessToken)
  const { chatInfo, usersData, historicalData, messageCounts } = data

  if (error) return <ErrorWrapper>{error}</ErrorWrapper>

  return (
    <>
      <ChatInfo
        data={chatInfo}
        loading={loading}
        chatId={chatId}
        hasPhoto={hasPhoto}
        memberCount={memberCount}
      />
      <Wrapper>
        {loading ? (
          <Container role="status" aria-label="Loading chat statistics">
            <StatisticsSkeleton />
            <StatisticsSkeleton />
            <StatisticsSkeleton />
          </Container>
        ) : (
          <Container>
            <LastDayStatistics usersData={usersData} />
            <MessageVolume messageCounts={messageCounts} />
            <HistoricalStatistics historicalData={historicalData || []} />
          </Container>
        )}
      </Wrapper>
    </>
  )
}
