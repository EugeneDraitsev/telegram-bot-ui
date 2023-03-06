'use client'

import styled from 'styled-components'
import { times } from 'lodash-es'

import {
  Spinner,
  Card,
  LastDayStatistics,
  HistoricalStatistics,
} from '@/components'
import { useChatData } from '@/hooks'

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
  params: { id: string }
}

const ChatPage = ({ params }: ChatPageProps) => {
  const { loading, data, error } = useChatData(params.id)
  const { usersData, historicalData } = data

  if (error) {
    return <LoadingWrapper>{error || 'Something Went Wrong'}</LoadingWrapper>
  }

  return (
    <>
      <Wrapper>
        {loading && (
          <Container>
            {times(2, (i) => (
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

export const runtime = 'experimental-edge'
