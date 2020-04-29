import React from 'react'
import styled from 'styled-components'

import { Tabs } from '../src/components'

export default {
  title: 'Tabs',
}

const Wrapper = styled.div`
  width: 420px;
  height: 300px;
  background-color: white;
  border: 1px solid gray;
  padding: 10px;
`
const Content = styled.div`
  padding: 10px;
`

const tabs = ['Tab1', 'Veeeeeery Loooooong Name Tab', 'Some other tab', 'tab 4']

export const SimpleTabs = () => <SimpleTabsStory />

class SimpleTabsStory extends React.Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    selectedIndex: 0,
  }

  onTabClick = (newIndex: number) => {
    this.setState({ selectedIndex: newIndex })
  }

  render() {
    const { selectedIndex } = this.state
    return (
      <Wrapper>
        <Tabs
          tabs={tabs}
          selectedIndex={selectedIndex}
          onTabClick={this.onTabClick}
          tabWidth={100}
        />
        <Content>
          selected {tabs[selectedIndex]} tab!
        </Content>
      </Wrapper>
    )
  }
}
