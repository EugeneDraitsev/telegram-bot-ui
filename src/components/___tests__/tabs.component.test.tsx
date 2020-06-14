import React from 'react'
// eslint-disable-next-line import/no-extraneous-dependencies
import { render, screen, act, fireEvent } from '@testing-library/react'

import { Tabs } from '..'
import { ThemeProvider } from '../../contexts'

describe('Tabs Component', () => {
  it('handles tab switching properly', () => {
    const tabs = ['Tab1', 'Veeeeeery Loooooong Name Tab', 'Some other tab', 'tab 4']
    const handleTabClick = jest.fn()

    render(
      <ThemeProvider>
        <Tabs tabs={tabs} selectedIndex={0} onTabClick={handleTabClick} tabWidth={100} />
      </ThemeProvider>,
    )

    act(() => {
      fireEvent.click(screen.getByText(/Veeeeeery/i))
    })

    expect(handleTabClick).toHaveBeenCalledTimes(1)
    expect(handleTabClick).toBeCalledWith(1)

    act(() => {
      fireEvent.click(screen.getByText(/tab 4/i))
    })

    expect(handleTabClick).toHaveBeenCalledTimes(2)
    expect(handleTabClick).toBeCalledWith(3)
  })
})
