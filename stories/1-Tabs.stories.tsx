import { useState } from 'react'
import styled from 'styled-components'

import { Tabs } from '@/components'

export default {
  title: 'Tabs',
  component: Tabs,
}

export const SimpleTabs = {
  args: {
    tabs: ['Tab1', 'Tab 2', 'Tab 3'],
  },
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

export const LongTabs = () => {
  const tabs = [
    'Tab1',
    'Veeeeeery Loooooong Name Tab',
    'Some other tab',
    'tab 4',
  ]
  const [selectedIndex, setSelectedIndex] = useState(0)

  return (
    <Wrapper>
      <Tabs
        tabs={tabs}
        selectedIndex={selectedIndex}
        onTabClick={setSelectedIndex}
        tabWidth={100}
      />
      <Content>selected {tabs[selectedIndex]} tab!</Content>
    </Wrapper>
  )
}
