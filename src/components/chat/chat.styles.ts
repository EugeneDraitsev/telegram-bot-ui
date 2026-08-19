'use client'

import styled, { keyframes } from 'styled-components'

import { Card } from '@/components/card.component'

export const GraphCard = styled(Card)`
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
export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  width: 100%;
  padding: 0 20px;
  margin-bottom: 15px;
`
export const Title = styled.div`
  font-size: 22px;
  font-weight: 300;
  line-height: 33px;
  @media (max-width: 800px) {
    font-size: 16px;
    line-height: 22px;
  }
`
export const SubTitle = styled.div`
  font-size: 12px;
  line-height: 18px;
  padding: 5px 0;
  font-weight: normal;
`

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.45; }
`
export const SkeletonBlock = styled.div<{ $width: string; $height: string }>`
  flex-shrink: 0;
  width: ${(p) => p.$width};
  height: ${(p) => p.$height};
  border-radius: 4px;
  background: #ececec;
  animation: ${pulse} 1.4s ease-in-out infinite;
  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`
