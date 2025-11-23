import { getDriverDbConnection } from "@/data/driver-db"
import { driverCollection } from "@/data/driver-db/collections"
import { DbDriver } from "@/data/driver-db/types"
import { ChangeStreamUpdateDocument } from "mongodb"

export const listenToDriverChanges = async (io: any) => {
  const db = await getDriverDbConnection()
  const driverChangeStream = driverCollection(db).watch([{
    $match: {
      operationType: {$in: ['insert', 'update']}
    }
  }], {
    fullDocument: 'updateLookup'
  })

  driverChangeStream.on('change', async (change: ChangeStreamUpdateDocument<DbDriver>) => {
    const {updateDescription = {} } = change

    const updatedFields = Object.keys(updateDescription.updatedFields || {})
    if (updatedFields.includes('serviceStatus')) {
      const {busyCount, onlineCount} = await getDriverCount()
      io.emit("driver-updated", {
        busyCount,
        onlineCount
      })
    }
  })
}

export const getDriverCount = async () => {
  const db = await getDriverDbConnection()
  const onlineCount = await driverCollection(db).countDocuments({ serviceStatus: 200 })
  const busyCount = await driverCollection(db).countDocuments({ serviceStatus: 201 })

  return {
    onlineCount,
    busyCount
  }
}
