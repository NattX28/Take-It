import { AuthUser, User } from "../libs/interfaces"
import prisma from "../libs/prisma"
import bcrypt from "bcryptjs"
import { createToken } from "../utils/jwt"

export const signup = async (
  username: string,
  email: string,
  password: string
): Promise<User | null> => {
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ username }, { email }],
    },
  })

  if (existingUser) {
    return null
  }

  const salt = await bcrypt.genSalt(10)
  const hashPassword = await bcrypt.hash(password, salt)

  const user = await prisma.user.create({
    data: {
      username,
      email,
      hashPassword,
    },
  })

  // send data back without reveal password
  const { hashPassword: _, ...userWithoutPassword } = user

  return userWithoutPassword as User
}

export const login = async (
  username: string,
  password: string
): Promise<AuthUser | null> => {
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) return null

  const isPasswordValid = await bcrypt.compare(password, user.hashPassword)
  if (!isPasswordValid) return null

  const token = createToken({ id: user.id, username: user.username })

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    token,
  }
}
