import { GitHub } from 'react-feather'

import { Input } from '@/components'

export default {
  title: 'Input',
  component: Input,
  argTypes: {
    icon: {
      control: { type: 'text' },
    },
  },
}

export const Simple = {
  args: {
    value: 'Simple input',
  },
}

export const IconInput = {
  render: () => (
    <div className="flex" style={{ gap: 10 }}>
      <div>
        <Input icon={<GitHub />} defaultValue={'Simple input'} />
      </div>
      <div>
        <Input icon="🐈" value={'Emoji 🦄'} />
      </div>
      <div>
        <Input
          icon="$"
          iconPadding={20}
          value={'123,43'}
          style={{ width: 215 }}
        />
      </div>
    </div>
  ),
}
