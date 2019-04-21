import React from 'react'
import styled from 'styled-components/macro'

const Wrapper = styled.div<{ minHeight?: string }>`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: calc(100% - 40px);
  min-height: 100vh;
  padding: 0 20px;
  align-items: center;
  justify-content: center;
`
const Title = styled.div`
  font-size: 44px;
  font-weight: 300;
  text-align: center;
`
const Text = styled.p`
  text-align: center;
`

interface ErrorContainerProps {
  className?: string
  title?: string | number
  text?: string
}

export default ({ className, title = '404', text = 'Page not found 😿' }: ErrorContainerProps) => (
  <Wrapper className={className}>
    <Title>{title}</Title>
    <Text>{text}</Text>
  </Wrapper>
)
