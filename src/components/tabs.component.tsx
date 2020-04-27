import React, { useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import { range, map, indexOf, sum } from 'lodash-es'

const Wrapper = styled.div`
  position: relative;
  display: flex;
  align-items: flex-end;
`
const Inner = styled.div`
  display: table;
  position: relative;
`
const Tab = styled.div<{ active: boolean, tabWidth: string, onClick(): void }>`
  display: table-cell;
  max-width: ${(p) => p.tabWidth};
  min-width: ${(p) => p.tabWidth};
  height: 50px;
  text-align: center;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
  color: #9B9B9B;
  line-height: 50px;
  font-weight: 500;
  font-size: 12px;
  overflow: hidden;
  cursor: pointer;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: 0.4s background-color;
  &:hover {
    background-color: rgba(0, 0, 0, 0.025);
  }
  &.active {
    color: #4A4A4A;
  }
`
const TabIndicator = styled.div<{ tabIndex: number, width: number, x: number }>`
  display: ${(p) => (p.tabIndex >= 0 ? 'block' : 'none')};
  position: absolute;
  left: 0;
  bottom: 0;
  content: '';
  width: ${(p) => p.width}px;
  height: 3px;
  background-color: ${(p) => p.theme.colors.primary};
  transition: transform 0.6s;
  transform: translateX(${(p) => p.x}px);
`

interface TabsProps {
  tabs: string[]
  selectedTab?: string
  selectedIndex?: number
  className?: string
  tabWidth?: number
  style?: object
  tabsNames?: string[]

  onTabClick(tab: number): void
}

export const Tabs = (props: TabsProps) => {
  const {
    tabs, tabsNames = [], className, selectedIndex, tabWidth, onTabClick, style, ...rest
  } = props
  const tabsWrapper = useRef<HTMLDivElement>(null)
  const [loaded, setLoaded] = useState(false)
  useEffect(() => setLoaded(true), [])

  const selectedTab = rest.selectedTab || tabs[selectedIndex!]
  const tabIndex = indexOf(tabs, selectedTab)

  const [indicatorWidth, indicatorX] = useMemo(() => {
    if (tabsWrapper.current && loaded) {
      const allTabs = Array.from(tabsWrapper.current.querySelectorAll('.tab'))
      const activeTab = allTabs[tabIndex]
      if (activeTab) {
        const newWidth = activeTab.getBoundingClientRect().width
        const newX = sum(allTabs.slice(0, tabIndex).map((x) => x.getBoundingClientRect().width))
        return [newWidth, newX]
      }
    }
    return [0, 0]
  }, [tabIndex, loaded])

  return (
    <Wrapper className={className} style={style}>
      <Inner ref={tabsWrapper}>
        {map(range(tabs.length), (index) => (
          <Tab
            tabWidth={tabWidth ? `${tabWidth}px` : 'auto'}
            key={index}
            active={selectedTab === tabs[index]}
            className={selectedTab === tabs[index] ? 'tab active' : 'tab'}
            onClick={() => onTabClick(index)}
          >
            {tabsNames[index] || tabs[index]}
          </Tab>
        ))}
        <TabIndicator width={indicatorWidth} x={indicatorX} tabIndex={tabIndex} />
      </Inner>
    </Wrapper>
  )
}
