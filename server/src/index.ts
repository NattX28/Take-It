import express from "express"
import dotenv from "dotenv"

dotenv.config()
const isProd = process.env.NODE_ENV === "production"
const PORT = process.env.PORT || 5000

if (isProd) {
  console.log("Running in production mode")
  // e.g. enable rate limiting, disable detailed error logs, etc.
} else {
  console.log("Running in development mode")
  // e.g. enable CORS for localhost, use morgan for logging, etc.
}

const app = express()
app.use(express.json())

app.listen(PORT, () => {
  console.log(`Server run at port ${PORT}`)
})
