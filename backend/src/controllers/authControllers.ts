import {
  ApiResponse,
  AuthUser,
  LoginCredentials,
  NewUser,
  User,
} from "../libs/interfaces"
import * as authServices from "../services/authServices"
import { Request, Response } from "express"

export const signup = async (req: Request, res: Response) => {
  const { username, email, password }: NewUser = req.body

  try {
    const user = await authServices.signup(username, email, password)
    if (!user) {
      res.status(409).json({
        status: 409,
        message: "Registration failed",
        error: "Email or username alreadyexits",
      } as ApiResponse<null>)
      return
    }

    res.status(200).json({
      status: 200,
      message: "User created successfully",
      data: user,
    } as ApiResponse<User>)
    return
  } catch (error) {
    console.log(error)
    res.status(500).json({
      status: 500,
      message: "Internal server error",
      error: "Something went wrong during registration",
    } as ApiResponse<null>)
    return
  }
}

export const login = async (req: Request, res: Response) => {
  const { username, password }: LoginCredentials = req.body

  try {
    const authData = await authServices.login(username, password)
    if (!authData) {
      res.status(401).json({
        status: 401,
        message: "Authentication failed",
        error: "Invalid username or password",
      } as ApiResponse<null>)
      return
    }

    res
      .cookie("authToken", authData?.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .status(200)
      .json({
        status: 200,
        message: "Login successful",
        data: authData,
      } as ApiResponse<AuthUser>)
    return
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({
      status: 500,
      message: "Internal server error",
      error: "Something went wrong during login",
    } as ApiResponse<null>)
    return
  }
}
