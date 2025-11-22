import { MongoCollection } from '@mezorn-com/mzrn-mongodb'

import { DbDevice } from './types'

export const deviceCollection = MongoCollection<DbDevice>('devices')
