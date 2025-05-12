import { Request, Response, NextFunction } from "express"
import { ApiResponse } from "../libs/interfaces"
import { verifyToken } from "../utils/jwt"

declare module "express" {
  interface Request {
    user?: {
      id: number
      username: string
    }
  }
}

export const requiredAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.authToken

  if (!token) {
    res.status(401).json({
      status: 401,
      message: "Unauthorized",
      error: "No token provided",
    } as ApiResponse<null>)
    return
  }

  try {
    const decoded = verifyToken(token)

    const currentTime = Math.floor(Date.now() / 1000)
    if (decoded.exp < currentTime) {
      res.status(401).json({
        status: 401,
        message: "Unauthorized",
        error: "Token has expired",
      } as ApiResponse<null>)
      return
    }

    req.user = { id: decoded.id, username: decoded.username }
    next()
  } catch (error) {
    res.status(401).json({
      status: 401,
      message: "Unauthorized",
      error: "Invalid or expired token",
    } as ApiResponse<null>)
    return
  }
}
