import { Spinner } from '@/components'

export default {
  title: 'Spinners',
  component: Spinner,
  argTypes: {
    size: {
      control: { type: 'number' },
    },
  },
}

export const SimpleSpinner = {}

export const DifferentSpinners = () => {
  const radius = 100 // number('radius', 100)
  const color = 'green' // text('color', 'green')
  return (
    <>
      <Spinner />
      <Spinner size={105} />
      <Spinner color="red" />
      <Spinner size={radius} color={color} />
    </>
  )
}
