import { DailyUsersPie, DailyUsersBars } from '@/components'
import type { DailyUserData } from '@/types'

export default {
  title: 'Graphs',
}

const data = [
  { id: 1, username: 'user1', messages: 62 },
  { id: 2, username: 'user2', messages: 52 },
  { id: 3, username: 'user3', messages: 30 },
  { id: 4, username: 'user4', messages: 27 },
  { id: 5, username: 'user5', messages: 16 },
  { id: 6, username: 'user6', messages: 10 },
  { id: 7, username: 'user7', messages: 9 },
  { id: 8, username: 'user8', messages: 5 },
  { id: 9, username: 'user9', messages: 3 },
]

export const BarChart = () => <DailyUsersPie data={data as DailyUserData[]} />
export const PieChart = () => <DailyUsersBars data={data as DailyUserData[]} />
