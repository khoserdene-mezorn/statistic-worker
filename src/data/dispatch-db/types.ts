import { WithId } from 'mongodb'

import { WithDates } from '@/data/base'

export type Request = WithId<DbRequest>
export type DbRequest = WithDates & {
}
