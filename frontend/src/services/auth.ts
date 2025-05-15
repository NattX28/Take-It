import { ApiResponse, AuthUser, User } from "@/types/interfaces"
import { api } from "./api"

export const login = async (
  username: string,
  password: string
): Promise<ApiResponse<AuthUser>> => {
  try {
    const response = await api.post<ApiResponse<AuthUser>>(`/login`, {
      username,
      password,
    })
    return response.data
  } catch (error) {
    console.error("Login error:", error)
    throw error
  }
}

export const signup = async (
  username: string,
  email: string,
  password: string
): Promise<ApiResponse<User>> => {
  try {
    const response = await api.post<ApiResponse<User>>(`/signup`, {
      username,
      email,
      password,
    })
    return response.data
  } catch (error) {
    console.error("Signup error:", error)
    throw error
  }
}
