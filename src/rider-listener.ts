import { getAccountDbConnection } from "@/data/account-db"
import { deviceCollection } from "@/data/account-db/collections"

export const listenToRiderChanges = async (io: any) => {
  const db = await getAccountDbConnection()
  const riderChangeStream = deviceCollection(db).watch([{
    $match: {
      operationType: {$in: ['insert']}
    }
  }], {
    fullDocument: 'updateLookup'
  })

  riderChangeStream.on('change', async () => {
    console.log('rider added')
    const { count } = await getRiderCount()
    io.emit("rider-count", {
      count
    })
  })
}

export const getRiderCount = async () => {
  const db = await getAccountDbConnection()
  const count = await deviceCollection(db).countDocuments({})
  return {
    count
  }
}
