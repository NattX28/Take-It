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

export interface AuthUser extends User {
  token: string
}

// friendship interface
// Friendship related interfaces
export interface NewFriendship {
  userId2: number
}

export interface Friendship {
  id: number
  userId1: number
  userId2: number
  status: "pending" | "accepted" | "rejected"
  createdAt: Date
  updatedAt: Date
  userOne?: User
  userTwo?: User
}

export interface CameraConsoleProps {
  isCaptureMode: boolean
  hasMultipleCameras: boolean
  isCameraOn: boolean
  onTakePhoto: () => void
  onCancle: () => void
  onUpload: () => void
  onToggleCaption: () => void
  onSwitchCamera: () => void
  onStartCamera: () => void
}
