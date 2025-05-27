import { Socket, Server as SocketIOServer } from "socket.io"
import * as chatServices from "./chatServices"
import prisma from "../libs/prisma"

export const joinChatRoom = async (socket: Socket, chatRoomId: number) => {
  try {
    // Verify user is participant in this chat room
    const participant = await prisma.chatRoomParticipant.findUnique({
      where: {
        chatRoomId_userId: {
          chatRoomId,
          userId: socket.data.userId,
        },
      },
    })

    if (!participant) {
      socket.emit("error", "You are not a participant in this chat room")
      return false
    }

    // Join the socket room
    await socket.join(chatRoomId.toString())

    // Notify other participants
    socket.to(chatRoomId.toString()).emit("user_joined", {
      userId: socket.data.userId,
      username: socket.data.username,
      chatRoomId,
    })

    return true
  } catch (error) {
    console.error("Error joining chat room: ", error)
    socket.emit("error", "Failed to join chat room")
    return false
  }
}

export const leavedChatRoom = async (socket: Socket, chatRoomId: number) => {
  try {
    // Leave the socket room
    await socket.leave(chatRoomId.toString())

    // Notify other participants
    socket.to(chatRoomId.toString()).emit("user_left", {
      userId: socket.data.userId,
      username: socket.data.username,
      chatRoomId,
    })

    return true
  } catch (error) {
    console.error("Error leaving chat room: ", error)
    return false
  }
}

export const socketSendMessage = async (
  socket: Socket,
  io: SocketIOServer,
  data: { chatRoomId: number; content: string }
) => {
  try {
    const message = await chatServices.sendMessage(
      data.chatRoomId,
      socket.data.userId,
      data.content
    )

    // Emit to all participants in the chat room
    io.to(data.chatRoomId.toString()).emit("message_received", message)

    return message
  } catch (error) {
    console.error("Error sending socket message: ", error)
    if (error instanceof Error) {
      socket.emit("error", error.message)
    } else {
      socket.emit("error", "Failed to send message")
    }
    return null
  }
}

export const markMessagesAsRead = async (
  socket: Socket,
  io: SocketIOServer,
  data: { chatRoomId: number; messageIds: number[] }
) => {
  try {
    // Verify user is participant
    const participant = await prisma.chatRoomParticipant.findUnique({
      where: {
        chatRoomId_userId: {
          chatRoomId: data.chatRoomId,
          userId: socket.data.userId,
        },
      },
    })

    if (!participant) {
      socket.emit("error", "You are not a participant in this chat room")
      return false
    }

    // Update message as read
    await prisma.message.updateMany({
      where: {
        id: { in: data.messageIds },
        chatRoomId: data.chatRoomId,
        userId: { not: socket.data.userId }, // Don't mark own messages as read
      },
      data: {
        isRead: true,
      },
    })

    // Notify other paarticipants
    socket.to(data.chatRoomId.toString()).emit("messages_read", {
      chatRoomId: data.chatRoomId,
      messageIds: data.messageIds,
      readByUserId: socket.data.userId,
    })
  } catch (error) {
    console.error("Error marking messages as read: ", error)
    socket.emit("error", "Failed to mark messages as read")
  }
}
