import type { StorybookConfig } from '@storybook/nextjs-vite'

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.js', '../stories/**/*.stories.tsx'],
  addons: ['@storybook/addon-docs'],

  framework: {
    name: '@storybook/nextjs-vite',
    options: {},
  }
}
export default config
