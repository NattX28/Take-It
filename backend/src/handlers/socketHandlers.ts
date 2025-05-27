import { Socket, Server as SocketIOServer } from "socket.io"
import * as socketServices from "../services/socketServices"

export const handleConnection = (io: SocketIOServer, socket: Socket) => {
  console.log(`User ${socket.data.username} (${socket.data.userId}) connected`)

  // Handle joining chat rooms
  socket.on("join_chat", async (chatRoomId: number) => {
    await socketServices.joinChatRoom(socket, chatRoomId)
  })

  // Handle leaving chat rooms
  socket.on("leave_chat", async (chatRoomId: number) => {
    await socketServices.leavedChatRoom(socket, chatRoomId)
  })

  // Handle sending messages
  socket.on(
    "send_message",
    async (data: { chatRoomId: number; content: string }) => {
      await socketServices.socketSendMessage(socket, io, data)
    }
  )

  // Handle typing indicators
  socket.on("typing_start", (chatRoomId: number) => {
    socket.to(chatRoomId.toString()).emit("user_typing", {
      userId: socket.data.userId,
      username: socket.data.username,
      chatRoomId,
    })
  })

  socket.on("typing_stop", (chatRoomId: number) => {
    socket.to(chatRoomId.toString()).emit("user_stopped_typing", {
      userId: socket.data.userId,
      username: socket.data.username,
      chatRoomId,
    })
  })

  // Handle message read status
  socket.on(
    "mark_as_read",
    async (data: { chatRoomId: number; messageIds: number[] }) => {
      await socketServices.markMessagesAsRead(socket, io, data)
    }
  )

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(
      `User ${socket.data.username} (${socket.data.userId}) disconnected`
    )
  })
}
