import { MongoCollection } from '@mezorn-com/mzrn-mongodb'

import { DbRequest } from './types'

export const requestCollection = MongoCollection<DbRequest>('requests')
