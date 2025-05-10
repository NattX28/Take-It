import jwt from "jsonwebtoken"
import { User } from "../libs/interfaces"

export const createToken = (user: { id: number; username: string }) => {
  return jwt.sign(
    { id: user.id, username: user.username },
    (process.env.JWT_SECRET as string) || "fallback_secret",
    {
      expiresIn: "7d",
    }
  )
}

export const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET as string)
}
