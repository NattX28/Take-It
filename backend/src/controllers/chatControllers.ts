import { Request, Response } from "express"
import {
  ApiResponse,
  ChatListItem,
  ChatRoom,
  Message,
} from "../libs/interfaces"
import * as chatServices from "../services/chatServices"

export const getChatList = async (req: Request, res: Response) => {
  const userId = req.user?.id
  if (!userId) {
    res.status(401).json({
      status: 401,
      message: "Unautorized",
      error: "User'id is required",
    } as ApiResponse<null>)
    return
  }

  try {
    const chatList = await chatServices.getChatList(userId)

    res.status(200).json({
      status: 200,
      message: "Chat list retrieved successfully",
      data: chatList,
    } as ApiResponse<ChatListItem[]>)
  } catch (error) {
    console.error("Get chat list error: ", error)
    res.status(500).json({
      status: 500,
      message: "Internal server error",
      error: "Failed to retrive chat list",
    } as ApiResponse<null>)
  }
}

export const createChatRoom = async (req: Request, res: Response) => {
  const userId = req.user?.id
  const { userId2 } = req.body

  if (!userId) {
    res.status(401).json({
      status: 401,
      message: "Unauthorized",
      error: "User ID is required",
    } as ApiResponse<null>)
    return
  }

  if (!userId2) {
    res.status(400).json({
      status: 400,
      message: "Bad request",
      error: "Target user ID is required",
    } as ApiResponse<null>)
    return
  }

  if (userId === userId2) {
    res.status(400).json({
      status: 400,
      message: "Bad request",
      error: "Cannot create chat room with yourself",
    } as ApiResponse<null>)
    return
  }

  const userId2Num: number =
    typeof userId2 === "string" ? parseInt(userId2) : userId2

  try {
    const chatRoom = await chatServices.createChatRoom(userId, userId2Num)

    res.status(201).json({
      status: 201,
      message: "Chat room created successfully",
      data: chatRoom,
    } as ApiResponse<ChatRoom>)
  } catch (error) {
    console.error("Create chat room error:", error)
    res.status(500).json({
      status: 500,
      message: "Internal server error",
      error: "Failed to create chat room",
    } as ApiResponse<null>)
  }
}

export const getChatMessages = async (req: Request, res: Response) => {
  const userId = req.user?.id
  const { chatRoomId } = req.params
  const { page = "1", limit = "50" } = req.query

  if (!userId) {
    res.status(401).json({
      status: 401,
      message: "Unauthorized",
      error: "User ID is required",
    } as ApiResponse<null>)
    return
  }

  const chatRoomIdNum: number = parseInt(chatRoomId)
  const pageNum: number = parseInt(page as string)
  const limitNum: number = parseInt(limit as string)

  if (isNaN(chatRoomIdNum)) {
    res.status(400).json({
      status: 400,
      message: "Bad request",
      error: "Invalid chat room Id",
    } as ApiResponse<null>)
    return
  }

  try {
    const result = await chatServices.getChatMessages(
      chatRoomIdNum,
      userId,
      pageNum,
      limitNum
    )

    res.status(200).json({
      status: 200,
      message: "Message retrived successfully",
      data: result,
    } as ApiResponse<{
      messages: Message[]
      pagination: {
        page: number
        limit: number
        total: number
        hasMore: boolean
      }
    }>)
  } catch (error) {
    console.error("Get chat messages error: ", error)

    if (
      error instanceof Error &&
      error.message === "User is not a participant in this chat room"
    ) {
      res.status(403).json({
        status: 403,
        message: "Forbidden",
        error: error.message,
      } as ApiResponse<null>)
      return
    }

    res.status(500).json({
      status: 500,
      message: "Internal server error",
      error: "Failed to retrieve messages",
    } as ApiResponse<null>)
  }
}

export const sendMessage = async (req: Request, res: Response) => {
  const userId = req.user?.id
  const { chatRoomId } = req.params
  const { content } = req.body

  if (!userId) {
    res.status(401).json({
      status: 401,
      message: "Unauthorized",
      error: "User ID is required",
    } as ApiResponse<null>)
    return
  }

  const chatRoomIdNum = parseInt(chatRoomId)

  if (isNaN(chatRoomIdNum)) {
    res.status(400).json({
      status: 400,
      message: "Bad request",
      error: "Invalid chat room ID",
    } as ApiResponse<null>)
    return
  }

  if (!content || content.trim().length === 0) {
    res.status(400).json({
      status: 400,
      message: "Bad request",
      error: "Message content is required",
    } as ApiResponse<null>)
  }

  try {
    const message = await chatServices.sendMessage(
      chatRoomIdNum,
      userId,
      content.trim()
    )

    res.status(201).json({
      status: 201,
      message: "Message sent successfully",
      data: message,
    } as ApiResponse<Message>)
  } catch (error) {
    console.error("Send message error:", error)

    if (
      error instanceof Error &&
      error.message === "User is not a participant in this chat room"
    ) {
      res.status(403).json({
        status: 403,
        message: "Forbidden",
        error: error.message,
      } as ApiResponse<null>)
      return
    }

    res.status(500).json({
      status: 500,
      message: "Internal server error",
      error: "Failed to send message",
    } as ApiResponse<null>)
  }
}
