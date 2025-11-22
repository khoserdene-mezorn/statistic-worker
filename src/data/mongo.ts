import { Document, Collection, Db, DbOptions, MongoClient, MongoClientOptions } from 'mongodb'

export const MongoCollection: <T extends Document> (name: string) => ((conn: Db) => Collection<T>) = (name) => {
  return (conn) => {
    return conn.collection(name)
  }
}

type Mongo = (url: string, db: string, options?: MongoClientOptions) => {
  getDb: (dbname?: string, options?: DbOptions) => Promise<Db>
}

const MongoImpl: Mongo = (url, db, options = {}) => {
  const client = new MongoClient(url, options)
  return {
    getDb: async (dbname, options) => {
      return client.db(dbname ?? db, options)
    }
  }
}

export default MongoImpl
