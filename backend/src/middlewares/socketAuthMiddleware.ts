import { Socket } from "socket.io"
import { parse } from "cookie"
import jwt from "jsonwebtoken"
import prisma from "../libs/prisma"

export const socketAuthMiddleware = async (
  socket: Socket,
  next: (err?: Error) => void
) => {
  try {
    const cookieHeader = socket.handshake.headers.cookie
    console.log("Raw cookie:", cookieHeader)

    if (!cookieHeader) {
      return next(new Error("No cookie header sent"))
    }

    const cookies = parse(cookieHeader)
    const token = cookies.authToken

    if (!token) {
      return next(new Error("Authentication token not found in cookies"))
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number
      username: string
    }

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
      select: {
        id: true,
        username: true,
        email: true,
      },
    })

    if (!user) {
      return next(new Error("User not found"))
    }

    // Attach user data to socket
    socket.data.userId = user.id
    socket.data.username = user.username

    next()
  } catch (error) {
    console.error("Socket auth failed:", error)
    next(new Error("Invalid or expired token"))
  }
}
