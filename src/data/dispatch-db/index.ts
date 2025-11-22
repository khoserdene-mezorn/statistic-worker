import { Mongo } from '@mezorn-com/mzrn-mongodb'

const { MONGO_URL = '', DISPATCH_DB = '' } = process.env

const mongo = Mongo(MONGO_URL, DISPATCH_DB)

export const getDispatchDbConnection = mongo.getDb
