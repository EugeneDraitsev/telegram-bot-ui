import { Button } from '@/components'

export default {
  title: 'Buttons',
}

export const Buttons = {
  args: {
    isLoading: true,
  },
  argTypes: {
    isLoading: {
      control: { type: 'boolean' },
    },
  },
  render: ({ isLoading }: { isLoading: boolean }) => {
    return (
      <>
        <Button style={{ marginRight: 10 }}>Default</Button>
        <Button style={{ marginRight: 10 }} disabled>
          Disabled
        </Button>
        <Button style={{ marginRight: 10 }} loading={isLoading}>
          Loading
        </Button>
      </>
    )
  },
}
