'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  position: relative;
  display: flex;
  align-items: flex-end;
`
const Inner = styled.div`
  display: table;
  position: relative;
`
const Tab = styled.button<{
  $active: boolean
  $tabWidth: string
}>`
  display: table-cell;
  max-width: ${(p) => p.$tabWidth};
  min-width: ${(p) => p.$tabWidth};
  height: 50px;
  text-align: center;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
  color: ${(p) => (p.$active ? '#4a4a4a' : '#9b9b9b')};
  border: 0;
  background: transparent;
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
  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.primary};
    outline-offset: -2px;
  }
`
const TabIndicator = styled.div<{
  $visible: boolean
  $width: number
  $x: number
}>`
  display: ${(p) => (p.$visible ? 'block' : 'none')};
  position: absolute;
  left: 0;
  bottom: 0;
  content: '';
  width: ${(p) => p.$width}px;
  height: 3px;
  background-color: ${(p) => p.theme.colors.primary};
  transition: transform 0.6s;
  transform: translateX(${(p) => p.$x}px);
`

interface TabsProps {
  tabs: string[]
  selectedTab?: string
  selectedIndex?: number
  className?: string
  tabWidth?: number
  style?: CSSProperties
  tabsNames?: string[]
  onTabClick(tab: number): void
}

export const Tabs = (props: TabsProps) => {
  const {
    tabs,
    tabsNames = [],
    className,
    selectedIndex,
    tabWidth,
    onTabClick,
    style,
    ...rest
  } = props
  const tabsWrapper = useRef<HTMLDivElement>(null)
  const selectedTab = rest.selectedTab ?? tabs[selectedIndex ?? 0]
  const tabIndex = tabs.indexOf(selectedTab)
  const [indicator, setIndicator] = useState({ width: 0, x: 0 })

  useLayoutEffect(() => {
    const wrapper = tabsWrapper.current
    if (!wrapper || tabIndex < 0) {
      return
    }

    const measure = () => {
      const allTabs = Array.from(wrapper.querySelectorAll('button'))
      const activeTab = allTabs[tabIndex]
      if (!activeTab) {
        return
      }

      setIndicator({
        width: activeTab.getBoundingClientRect().width,
        x: allTabs
          .slice(0, tabIndex)
          .reduce((total, tab) => total + tab.getBoundingClientRect().width, 0),
      })
    }

    const frame = requestAnimationFrame(measure)
    const observer =
      typeof ResizeObserver === 'undefined'
        ? undefined
        : new ResizeObserver(measure)
    observer?.observe(wrapper)
    return () => {
      cancelAnimationFrame(frame)
      observer?.disconnect()
    }
  }, [tabIndex])

  return (
    <Wrapper className={className} style={style}>
      <Inner ref={tabsWrapper} role="tablist">
        {tabs.map((tab, index) => (
          <Tab
            $tabWidth={tabWidth ? `${tabWidth}px` : 'auto'}
            $active={selectedTab === tab}
            key={`${tab}-${index}`}
            type="button"
            role="tab"
            aria-selected={selectedTab === tab}
            onClick={() => onTabClick(index)}
          >
            {tabsNames[index] || tab}
          </Tab>
        ))}
        <TabIndicator
          $width={indicator.width}
          $x={indicator.x}
          $visible={tabIndex >= 0}
          aria-hidden="true"
        />
      </Inner>
    </Wrapper>
  )
}
