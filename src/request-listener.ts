import { getDispatchDbConnection } from "@/data/dispatch-db"
import { requestCollection } from "@/data/dispatch-db/collections"

export const listenToRequestChanges = async (io: any) => {
  const db = await getDispatchDbConnection()
  const requestChangeStream = requestCollection(db).watch([{
    $match: {
      operationType: {$in: ['insert']}
    }
  }], {
    fullDocument: 'updateLookup'
  })

  requestChangeStream.on('change', async () => {
    console.log('request added')
    const { count } = await getRequestCount()
    io.emit("request-count", {
      count
    })
  })
}

export const getRequestCount = async () => {
  const db = await getDispatchDbConnection()
  const count = await requestCollection(db).countDocuments({})
  return {
    count
  }  
}
