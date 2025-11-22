import { Mongo } from "@/data"

const { MONGO_URL = '', DRIVER_DB = '' } = process.env

const mongo = Mongo(MONGO_URL, DRIVER_DB)

export const getDriverDbConnection = mongo.getDb
