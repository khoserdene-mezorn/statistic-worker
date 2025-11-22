import { MongoCollection } from '@/data/mongo'

import { DbRequest } from './types'

export const requestCollection = MongoCollection<DbRequest>('requests')
