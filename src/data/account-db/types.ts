import { WithId } from 'mongodb'

import { WithDates } from '@/data/base'

export type Device = WithId<DbDevice>
export type DbDevice = WithDates & {
}
