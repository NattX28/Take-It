import {
  ApiResponse,
  ChatListItem,
  ChatRoom,
  Message,
  User,
} from "@/types/interfaces"
import { api } from "./api"
const BASE_URL_CHAT = "/chats"

// Get chat list
export const getChatList = async (): Promise<ApiResponse<ChatListItem[]>> => {
  try {
    const response = await api.get<ApiResponse<ChatListItem[]>>(
      `${BASE_URL_CHAT}`
    )
    return response.data
  } catch (error) {
    console.error("Get chat list error:", error)
    throw error
  }
}

// Create chat room
export const createChatRoom = async (
  userId2: number
): Promise<ApiResponse<ChatRoom>> => {
  try {
    const response = await api.post<ApiResponse<ChatRoom>>(`${BASE_URL_CHAT}`, {
      userId2,
    })
    return response.data
  } catch (error) {
    console.error("Create chat room error:", error)
    throw error
  }
}

// Get chat messages
export const getChatMessages = async (
  chatRoomId: number,
  page: number = 1,
  limit: number = 50
): Promise<
  ApiResponse<{
    messages: Message[]
    pagination: { page: number; limit: number; total: number; hasMore: boolean }
  }>
> => {
  try {
    const response = await api.get<
      ApiResponse<{
        messages: Message[]
        pagination: {
          page: number
          limit: number
          total: number
          hasMore: boolean
        }
      }>
    >(`${BASE_URL_CHAT}/${chatRoomId}/messages`, { params: { page, limit } })
    return response.data
  } catch (error) {
    console.error("Get chat messages error:", error)
    throw error
  }
}

// Send message
export const sendMessage = async (
  chatRoomId: number,
  content: string
): Promise<ApiResponse<Message>> => {
  try {
    const response = await api.post<ApiResponse<Message>>(
      `${BASE_URL_CHAT}/${chatRoomId}/messages`,
      { content }
    )
    return response.data
  } catch (error) {
    console.error("Send message error:", error)
    throw error
  }
}
