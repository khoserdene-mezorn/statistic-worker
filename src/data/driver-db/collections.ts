import { MongoCollection } from '@/data/mongo'

import { DbDriver } from './types'

export const driverCollection = MongoCollection<DbDriver>('drivers')
