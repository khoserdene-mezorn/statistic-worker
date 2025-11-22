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
    const { count, acceptCount } = await getRequestCount()
    io.emit("request-count", {
      count,
      acceptCount
    })
  })
}

export const getRequestCount = async () => {
  const db = await getDispatchDbConnection()
  const count = await requestCollection(db).countDocuments({})
  const acceptCount = await requestCollection(db).countDocuments({ status: 'accepted' })

  return {
    count,
    acceptCount
  }
}
