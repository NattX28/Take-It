import express from "express"
import dotenv from "dotenv"
import { readdirSync } from "fs"
import path from "path"
import cookieParser from "cookie-parser"
import cors from "cors"
import morgan from "morgan"
import { createServer } from "http"
import { Server as SocketIOServer } from "socket.io"
import { socketAuthMiddleware } from "./middlewares/socketAuthMiddleware"
import {
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData,
} from "./libs/interfaces"
import { handleConnection } from "./handlers/socketHandlers"

dotenv.config()
const isProd = process.env.NODE_ENV === "production"
const PORT = process.env.PORT || 5000
const FRONTEND_URL = isProd ? process.env.FRONTEND_URL : "http://localhost:3000"

const app = express()
const server = createServer(app)

app.use(express.json())
app.use(cookieParser())

if (isProd) {
  console.log("Running in production mode")
  // e.g. enable rate limiting, disable detailed error logs, etc.
  app.use(
    cors({
      origin: process.env.FRONTEND_URL,
      credentials: true,
    })
  )
} else {
  console.log("Running in development mode")
  app.use(morgan("tiny"))
  // e.g. enable CORS for localhost, use morgan for logging, etc.
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  )
}

export const io = new SocketIOServer<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(server, {
  cors: {
    origin: FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
})

io.use(socketAuthMiddleware)

io.on("connection", (socket) => {
  handleConnection(io, socket)
})

// Load routes dynamically
const routesPath = path.join(__dirname, "routes")
readdirSync(routesPath).forEach((file) => {
  if (file.endsWith(".ts") || file.endsWith(".js")) {
    const route = require(path.join(routesPath, file))
    const routePath = `/api` // All routes will be prefixed with `/api`
    app.use(routePath, route.default || route) // Register the route
    console.log(`Route loaded: ${routePath}`)
  }
})

server.listen(PORT, () => {
  console.log(`Server run at port ${PORT}`)
})
