import { MongoCollection } from '@/data/mongo'

import { DbDevice } from './types'

export const deviceCollection = MongoCollection<DbDevice>('devices')
