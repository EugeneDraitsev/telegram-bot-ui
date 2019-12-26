import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { NextPageContext } from 'next'
import Head from 'next/head'
import styled from 'styled-components'
import { take, sumBy, isEmpty } from 'lodash-es'
import fetch from 'node-fetch'

import UsersBarChart from '../../components/users-bar-chart.component'
import UsersPieChart from '../../components/users-pie-chart.component'
import Tabs from '../../components/tabs.component'
import Card from '../../components/card.component'
import ChatInfo from '../../components/chat-info.component'
import Spinner from '../../components/spinner.component'
import { ChatData, useChatData } from '../../hooks'

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  margin: auto;
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
  @media(max-width: 800px) {
    margin: 10px;
    max-width: calc(100vw - 20px);
  }
`
const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: calc(100% - 40px);
  padding: 0 20px;
  flex-wrap: wrap;
  margin-bottom: 15px;
`
const Title = styled.div`
  font-size: 22px;
  font-weight: 300;
  line-height: 33px;
  @media(max-width: 800px) {
    font-size: 16px;
    line-height: 22px;
  }
`
const SubTitle = styled.div`
  font-size: 12px;
  line-height: 18px;
  padding: 5px 0;
  font-weight: normal;
`

type ChatPageProps = {
  initialData: ChatData
}

const ChatPage = ({ initialData }: ChatPageProps) => {
  const router = useRouter()
  const { id } = router.query
  const { loading, data, error } = useChatData(id as string, initialData)
  const [tab, setTab] = useState(0)

  const { usersData, chatInfo } = data || initialData

  if (error || isEmpty(usersData) || isEmpty(chatInfo)) {
    return <LoadingWrapper>{error}</LoadingWrapper>
  }

  if (loading) {
    return (
      <LoadingWrapper>
        <Spinner />
      </LoadingWrapper>
    )
  }

  return (
    <>
      <Head>
        <title>Telegram Bot Stats</title>
        {chatInfo.photoUrl && (
          <>
            <meta property="og:image" content={chatInfo.photoUrl} />
            <meta name="twitter:image" content={chatInfo.photoUrl} />
          </>
        )}
        {chatInfo.title && (
          <meta property="og:description" content={`${chatInfo.title} Statistics for the last 24 hours`} />
        )}
      </Head>
      <Wrapper>
        <ChatInfo data={chatInfo} />
        <GraphCard>
          <Header>
            <Title>
              Last 24h chat users statistics (Top 10 users)
              <SubTitle>All messages: {sumBy(usersData, 'messages')}</SubTitle>
            </Title>
            <Tabs
              tabs={['Barchart', 'Piechart']}
              selectedIndex={tab}
              onTabClick={(index) => setTab(index)}
            />
          </Header>
          {tab === 0 && <UsersBarChart data={take(usersData, 10)} />}
          {tab === 1 && <UsersPieChart data={take(usersData, 10)} />}
        </GraphCard>
      </Wrapper>
    </>
  )
}

ChatPage.getInitialProps = async ({ query }: NextPageContext) => {
  const { id } = query
  const url = 'https://yxol1ml0oj.execute-api.eu-central-1.amazonaws.com/prod'
  const initialData = await fetch(`${url}/getChatStats?chatId=${id}`, { timeout: 500 })
    .then((res) => res.json())
    .catch(() => [])
  return { initialData }
}

export default ChatPage
