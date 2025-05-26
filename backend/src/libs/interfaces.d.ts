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

// gallery (images)
export interface Gallery {
  id: number
  userId: number
  imageUrl: string
  caption?: string | null
  createdAt: Date
  isPublic: boolean
  user?: User
}

export interface PhotosInGallery {
  id: number
  page: number
  limit: number
  skip: number
}

// Chat related interfaces
export interface ChatRoom {
  id: number
  createdAt: Date
  participants: ChatRoomParticipant[]
  messages?: Message[]
  lastMessage?: Message
}

export interface ChatRoomParticipant {
  chatRoomId: number
  userId: number
  joinedAt: Date
  user: User
  chatRoom: ChatRoom
}

export interface Message {
  id: number
  chatRoomId: number
  userId: number
  content: string
  createdAt: Date
  isRead: boolean
  user: User
}

export interface ChatListItem {
  chatRoomId: number
  chatRoom: {
    id: number
    createdAt: Date
    participants: {
      user: {
        id: number
        username: string
        profilePicture?: string
        lastActive: Date
      }
    }[]
    lastMessage?: {
      id: number
      content: string
      createdAt: Date
      userId: number
      user: {
        username: string
      }
    }
  }
  joinedAt: Date
}
