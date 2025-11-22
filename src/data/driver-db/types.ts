import { WithId } from 'mongodb'

import { WithDates } from '@/data/base'

export type Driver = WithId<DbDriver>
export type DbDriver = WithDates & {
  serviceStatus: number
}
