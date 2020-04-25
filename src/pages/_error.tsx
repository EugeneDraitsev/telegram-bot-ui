import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
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
  statusCode: string
  className?: string
  title?: string | number
  text?: string
}

export default ({ className, statusCode, title, text = 'Page not found 😿' }: ErrorContainerProps) => (
  <Wrapper className={className}>
    <Title>{title || statusCode}</Title>
    <Text>{text}</Text>
  </Wrapper>
)
