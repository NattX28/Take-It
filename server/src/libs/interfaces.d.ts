// Generic API response interfaces
export interface ApiResponse<T> {
  status: number
  message: string
  data?: T
  error?: string
}

export interface User {
  id: number
  username: string
  email: string
  profilePicture?: string
  createdAt: Date
  lastActive: Date
}

export interface NewUser {
  username: string
  email: string
  password: string
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface AuthUser {
  id: number
  username: string
  email: string
  token: string
}
