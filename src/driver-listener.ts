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
    const {updateDescription = {}, fullDocument = {} } = change

    const updatedFields = Object.keys(updateDescription.updatedFields || {})
    if (updatedFields.includes('serviceStatus')) {
      const { serviceStatus } = fullDocument as any
      console.log({
        serviceStatus,
      })
      if (serviceStatus === 0) {
        console.log('driver is offline')
        const count = await driverCollection(db).countDocuments({ serviceStatus: 0 })
        console.log(count)
        io.emit("driver-offline", {
          count
        })
      } else if (serviceStatus === 200) {
        console.log('driver is online')
        const count = await driverCollection(db).countDocuments({ serviceStatus: 200 })
        console.log(count)
        io.emit("driver-online", {
          count
        })
      } else if (serviceStatus === 201) {
        console.log('driver is busy')
        const count = await driverCollection(db).countDocuments({ serviceStatus: 201 })
        console.log(count)
        io.emit("driver-busy", {
          count
        })
      }
    }
  })
}

export const getDriverCount = async () => {
  const db = await getDriverDbConnection()
  const offlineCount = await driverCollection(db).countDocuments({ serviceStatus: 0 })
  const onlineCount = await driverCollection(db).countDocuments({ serviceStatus: 200 })
  const busyCount = await driverCollection(db).countDocuments({ serviceStatus: 201 })
  return {
    offlineCount,
    onlineCount,
    busyCount
  }
}
