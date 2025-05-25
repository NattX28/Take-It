import {
  ApiResponse,
  Friendship,
  PendingRequest,
  User,
} from "@/types/interfaces"
import { api } from "./api"

const BASE_URL_FRIEND: string = "/friends"

export const sendFriendRequest = async (
  username: string
): Promise<ApiResponse<Friendship>> => {
  try {
    const response = await api.post(`${BASE_URL_FRIEND}/add`, { username })
    return response.data
  } catch (error) {
    console.error("Sending friend request error: ", error)
    throw error
  }
}

export const acceptFriendRequest = async (
  requesterId: number
): Promise<ApiResponse<Friendship>> => {
  try {
    const response = await api.post(`${BASE_URL_FRIEND}/accept`, {
      requesterId,
    })
    return response.data
  } catch (error) {
    console.error("Accepting friend request error: ", error)
    throw error
  }
}

export const rejectFriendRequest = async (
  requesterId: number
): Promise<ApiResponse<Friendship>> => {
  try {
    const response = await api.post(`${BASE_URL_FRIEND}/reject`, {
      requesterId,
    })
    return response.data
  } catch (error) {
    console.error("Rejecting friend request error: ", error)
    throw error
  }
}

export const getFriends = async (): Promise<ApiResponse<User[]>> => {
  try {
    const response = await api.get(`${BASE_URL_FRIEND}`)
    return response.data
  } catch (error) {
    console.error("Getting friends error: ", error)
    throw error
  }
}

export const getPendingfriendRequest = async (): Promise<
  ApiResponse<PendingRequest>
> => {
  try {
    const response = await api.get(`${BASE_URL_FRIEND}/pending`)
    return response.data
  } catch (error) {
    console.error("Get Pending friend request error: ", error)
    throw error
  }
}
