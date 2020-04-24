import React from 'react'
import { configure, addDecorator } from '@storybook/react'
import { themes } from '@storybook/theming'
import { withOptions } from '@storybook/addon-options'
import { configureViewport, INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { withBackgrounds } from '@storybook/addon-backgrounds'

addDecorator(
  withOptions({
    hierarchyRootSeparator: /\|/,
    hierarchySeparator: /[\/.]/,
    theme: themes.normal,
  }),
)

addDecorator(
  withBackgrounds([
    { name: 'dark (default)', value: '#393940', default: true },
    { name: 'light', value: '#fafafa' },
  ]),
)

configureViewport({
  viewports: {
    ...INITIAL_VIEWPORTS,
  },
})

function loadStories() {
  require('../src/stories/index.story.tsx')
}

configure(loadStories, module)
