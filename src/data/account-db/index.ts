import { Mongo } from "@/data"

const { MONGO_URL = '', ACCOUNT_DB = '' } = process.env

const mongo = Mongo(MONGO_URL, ACCOUNT_DB)

export const getAccountDbConnection = mongo.getDb
