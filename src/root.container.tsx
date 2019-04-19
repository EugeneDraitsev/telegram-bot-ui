import React, { useContext, useState } from 'react'
import styled from 'styled-components/macro'
import take from 'lodash/take'
import sumBy from 'lodash/sumBy'

import UsersBarChart from './components/users-bar-chart.component'
import UsersPieChart from './components/users-pie-chart.component'
import Spinner from './components/spinner.component'
import Tabs from './components/tabs.component'
import Card from './components/card.component'
import { ChatDataContext } from './contexts'

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  max-width: 1200px;
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
  margin: 20px;
  padding: 15px;
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
`
const SubTitle = styled.div`
  font-size: 12px;
  line-height: 18px;
  font-weight: normal;
`

export default () => {
  const { loading, data, error } = useContext(ChatDataContext)
  const [tab, setTab] = useState(0)

  if (loading) {
    return (
      <LoadingWrapper>
        <Spinner />
      </LoadingWrapper>
    )
  }

  if (error) {
    return <LoadingWrapper>{error}</LoadingWrapper>
  }

  return (
    <Wrapper>
      <GraphCard>
        <Header>
          <Title>
            Last 24h chat users statistics (Top 10 users)
            <SubTitle>All messages: {sumBy(data, 'messages')}</SubTitle>
          </Title>
          <Tabs
            tabs={['Barchart', 'Piechart']}
            selectedIndex={tab}
            onTabClick={index => setTab(index)}
          />
        </Header>
        {tab === 0 && <UsersBarChart data={take(data, 10)} />}
        {tab === 1 && <UsersPieChart data={take(data, 10)} />}
      </GraphCard>
    </Wrapper>
  )
}
