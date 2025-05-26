import { Socket } from "socket.io"
import jwt from "jsonwebtoken"
import prisma from "../libs/prisma"

export const socketAuthMiddleware = async (
  socket: Socket,
  next: (err?: Error) => void
) => {
  try {
    const token =
      socket.request.cookies?.authToken || socket.request.cookies?.token
    if (!token) {
      return next(new Error("Authentication token is required"))
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number
    }

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
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

    socket.data.userId = user.id
    socket.data.username = user.username
    next()
  } catch (error) {
    next(new Error("Invalid or expired token"))
  }
}
