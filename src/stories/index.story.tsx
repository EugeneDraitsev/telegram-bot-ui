import React from 'react'
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react'
import styled from 'styled-components/macro'
import GlobalStyles from '../styles/global.styles'


const StoriesWrapper = styled.div`
  min-height: calc(100vh - 40px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: transparent;
`

const StyledDecorator = (story: any) => (
  <>
    <GlobalStyles />
    {story()}
  </>
)

storiesOf('Common components', module)
  .addDecorator(StyledDecorator)
  .add('Logos / Avatars', () => (
    <StoriesWrapper>
      <StoriesWrapper>
        Hello, storybook
      </StoriesWrapper>
    </StoriesWrapper>
  ))
