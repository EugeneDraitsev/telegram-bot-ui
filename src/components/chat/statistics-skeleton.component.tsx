'use client'

import styled from 'styled-components'

import { GraphCard, Header, SkeletonBlock } from './chat.styles'

const SkeletonCard = styled(GraphCard)`
  justify-content: flex-start;
`
// The two groups keep the exact heights of the loaded header, so the card ends
// up the same size and nothing jumps once the data arrives: the title line plus
// the padded subtitle line on one side, the 50px tab strip on the other.
const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
  height: 61px;
  @media (max-width: 800px) {
    height: 50px;
  }
`
const TabsGroup = styled.div`
  display: flex;
  align-items: center;
  height: 50px;
`

export const StatisticsSkeleton = () => (
  <SkeletonCard>
    <Header>
      <TitleGroup>
        <SkeletonBlock $width="min(320px, 55vw)" $height="22px" />
        <SkeletonBlock $width="min(140px, 30vw)" $height="12px" />
      </TitleGroup>
      <TabsGroup>
        <SkeletonBlock $width="min(180px, 30vw)" $height="24px" />
      </TabsGroup>
    </Header>
    <SkeletonBlock $width="calc(100% - 40px)" $height="400px" />
  </SkeletonCard>
)
