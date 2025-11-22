import { MongoCollection } from '@mezorn-com/mzrn-mongodb'

import { DbDriver } from './types'

export const driverCollection = MongoCollection<DbDriver>('drivers')
