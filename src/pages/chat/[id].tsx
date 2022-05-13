import React from 'react'
import { useRouter } from 'next/router'
import { GetStaticProps } from 'next'
import Head from 'next/head'
import styled from 'styled-components'
import { isEmpty, times } from 'lodash-es'
import fetch from 'node-fetch'

import { Spinner, Card, ChatInfo, LastDayStatistics } from '../../components'
import { useChatData } from '../../hooks'
import { Chat } from '../../types'
import { config } from '../../api.config'
import { HistoricalStatistics } from '../../components/chat/historical-statistics.component'

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
  initialChatInfo: Chat | unknown
}

const ChatPage = ({ initialChatInfo }: ChatPageProps) => {
  const router = useRouter()
  const id = router?.query?.id
  const { loading, data, error } = useChatData(id as string)

  const { usersData, chatInfo = initialChatInfo as Chat, historicalData } = data

  if (loading && isEmpty(chatInfo)) {
    return (
      <LoadingWrapper>
        <Spinner />
      </LoadingWrapper>
    )
  }

  if (error) {
    return <LoadingWrapper>{error || 'Something Went Wrong'}</LoadingWrapper>
  }

  return (
    <>
      <Head>
        <title>Telegram Bot Stats</title>
        {chatInfo?.photoUrl && (
          <>
            <meta property="og:image" content={chatInfo?.photoUrl} />
            <meta name="twitter:image" content={chatInfo?.photoUrl} />
          </>
        )}
        {chatInfo?.title && (
          <meta
            property="og:description"
            content={`${chatInfo?.title} Statistics for the last 24 hours`}
          />
        )}
      </Head>
      <Wrapper>
        <ChatInfo data={chatInfo} />
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

export const getStaticPaths = async () => {
  // TODO: populate top 100 chats for dynamo
  const PREDEFINED_STATIC_PATHS = ['-1001306676509']
  const paths = PREDEFINED_STATIC_PATHS.map((id) => ({ params: { id } }))

  return { paths, fallback: true }
}

export const getStaticProps: GetStaticProps<ChatPageProps, { id: string }> = async ({ params }) => {
  const id = params?.id
  const url = `${config.s3}/${id}`
  const initialChatInfo = await fetch(url)
    .then((res) => res.json())
    .catch(() => {})

  return {
    props: {
      initialChatInfo,
    },
    revalidate: 60,
  }
}

export default ChatPage
