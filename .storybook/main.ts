import type { StorybookConfig } from '@storybook/nextjs'

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.js', '../stories/**/*.stories.tsx'],
  addons: ['@storybook/addon-docs'],

  framework: {
    name: '@storybook/nextjs',
    options: {},
  }
}
export default config
