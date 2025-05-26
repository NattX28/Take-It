import "http"
import "express"

declare module "express" {
  interface Request {
    user?: {
      id: number
      username: string
    }
  }
}

declare module "http" {
  interface IncomingMessage {
    cookies?: Record<string, string>
  }
}
