import { ApiResponse, User } from "@/types/interfaces"
import { api } from "./api"

export const login = async (
  username: string,
  password: string
): Promise<ApiResponse<User>> => {
  try {
    const response = await api.post<ApiResponse<User>>(`/login`, {
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

export const logout = async () => {
  try {
    await api.post<ApiResponse<null>>("/logout", {})
  } catch (error) {
    console.error("Logout error:", error)
    throw error
  }
}
