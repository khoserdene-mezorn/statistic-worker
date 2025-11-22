import { Server } from "socket.io"
import { createServer } from "http"

import { getDriverCount, listenToDriverChanges } from "@/driver-listener"
import { getRiderCount, listenToRiderChanges } from "@/rider-listener"
import { getRequestCount, listenToRequestChanges } from "@/request-listener"

const listener = false

const httpServer = createServer(async (req, res) => {
  // CORS headers нэмэх
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")

  // Preflight request шалгах
  if (req.method === "OPTIONS") {
    res.writeHead(204)
    res.end()
    return
  }

  if (req.method !== "GET") {
    res.writeHead(405, { "Content-Type": "application/json" })
    res.end(JSON.stringify({ error: "Method Not Allowed" }))
    return
  }
  switch (req.url) {
    case "/api/init": {
      res.writeHead(200, { "Content-Type": "application/json" })
      res.end(JSON.stringify({ listener }))
      break
    }
    case "/api/driver": {
      res.writeHead(200, { "Content-Type": "application/json" })
      const response = await getDriverCount()
      res.end(JSON.stringify(response))
      break
    }
    case "/api/rider": {
      res.writeHead(200, { "Content-Type": "application/json" })
      const response = await getRiderCount()
      res.end(JSON.stringify(response))
      break
    }
    case "/api/request": {
      res.writeHead(200, { "Content-Type": "application/json" })
      const response = await getRequestCount()
      res.end(JSON.stringify(response))
      break
    }
    default: {
      res.writeHead(404, { "Content-Type": "application/json" })
      res.end(JSON.stringify({ error: "Not Found" }))
      break
    }
  }
})
const io = new Server(httpServer, {
  cors: {
    origin: "*", // зөвхөн React app-ийн origin-оор хязгаарлаж болно
  },
})

const run = async () => {
  if (listener) {
    await listenToDriverChanges(io)
    await listenToRiderChanges(io)
    await listenToRequestChanges(io)
  }

  httpServer.listen(3001, "0.0.0.0", () => {
    console.log("Socket.IO server running on port 3001")
  })
}

run().catch(console.error)
