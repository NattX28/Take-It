import express from "express"
import dotenv from "dotenv"
import { readdirSync } from "fs"
import path from "path"
import cookieParser from "cookie-parser"
import cors from "cors"

dotenv.config()
const isProd = process.env.NODE_ENV === "production"
const PORT = process.env.PORT || 5000

const app = express()

if (isProd) {
  console.log("Running in production mode")
  // e.g. enable rate limiting, disable detailed error logs, etc.
} else {
  console.log("Running in development mode")
  // e.g. enable CORS for localhost, use morgan for logging, etc.
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  )
}

app.use(cookieParser())
app.use(express.json())

const routesPath = path.join(__dirname, "routes")
readdirSync(routesPath).forEach((file) => {
  if (file.endsWith(".ts") || file.endsWith(".js")) {
    const route = require(path.join(routesPath, file))
    const routePath = `/api` // All routes will be prefixed with `/api`
    app.use(routePath, route.default || route) // Register the route
    console.log(`Route loaded: ${routePath}`)
  }
})

app.listen(PORT, () => {
  console.log(`Server run at port ${PORT}`)
})
