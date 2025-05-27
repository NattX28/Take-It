import { useEffect, useRef } from "react"
import { io, Socket } from "socket.io-client"
import { Message, ChatListItem } from "@/types/interfaces"

interface ServerToClientEvents {
  message_received: (message: Message) => void
  user_joined: (data: {
    userId: number
    username: string
    chatRoomId: number
  }) => void
  user_left: (data: {
    userId: number
    username: string
    chatRoomId: number
  }) => void
  user_typing: (data: {
    userId: number
    username: string
    chatRoomId: number
  }) => void
  user_stopped_typing: (data: {
    userId: number
    username: string
    chatRoomId: number
  }) => void
  messages_read: (data: {
    chatRoomId: number
    messageIds: number[]
    readByUserId: number
  }) => void
  error: (error: string) => void
}

interface ClientToServerEvents {
  join_chat: (chatRoomId: number) => void
  leave_chat: (chatRoomId: number) => void
  send_message: (data: { chatRoomId: number; content: string }) => void
  typing_start: (chatRoomId: number) => void
  typing_stop: (chatRoomId: number) => void
  mark_as_read: (data: { chatRoomId: number; messageIds: number[] }) => void
}

interface UseSocketProps {
  onMessageReceived?: (message: Message) => void
  onUserJoined?: (data: {
    userId: number
    username: string
    chatRoomId: number
  }) => void
  onUserLeft?: (data: {
    userId: number
    username: string
    chatRoomId: number
  }) => void
  onUserTyping?: (data: {
    userId: number
    username: string
    chatRoomId: number
  }) => void
  onUserStoppedTyping?: (data: {
    userId: number
    username: string
    chatRoomId: number
  }) => void
  onMessagesRead?: (data: {
    chatRoomId: number
    messageIds: number[]
    readByUserId: number
  }) => void
  onError?: (error: string) => void
}

export const useSocket = (props: UseSocketProps = {}) => {
  const {
    onMessageReceived,
    onUserJoined,
    onUserLeft,
    onUserTyping,
    onUserStoppedTyping,
    onMessagesRead,
    onError,
  } = props

  const socketRef = useRef<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>(null)

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io(
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000",
      {
        withCredentials: true,
        transports: ["websocket", "polling"],
      }
    )

    const socket = socketRef.current

    // Set up event listeners
    socket.on("message_received", (message) => {
      onMessageReceived?.(message)
    })

    socket.on("user_joined", (data) => {
      onUserJoined?.(data)
    })

    socket.on("user_left", (data) => {
      onUserLeft?.(data)
    })

    socket.on("user_typing", (data) => {
      onUserTyping?.(data)
    })

    socket.on("user_stopped_typing", (data) => {
      onUserStoppedTyping?.(data)
    })

    socket.on("messages_read", (data) => {
      onMessagesRead?.(data)
    })

    socket.on("error", (error) => {
      onError?.(error)
    })

    socket.on("connect", () => {
      console.log("Connected to server")
    })

    socket.on("disconnect", () => {
      console.log("Disconnected from server")
    })

    return () => {
      socket.disconnect()
    }
  }, [
    onMessageReceived,
    onUserJoined,
    onUserLeft,
    onUserTyping,
    onUserStoppedTyping,
    onMessagesRead,
    onError,
  ])

  const joinChat = (chatRoomId: number) => {
    socketRef.current?.emit("join_chat", chatRoomId)
  }

  const leaveChat = (chatRoomId: number) => {
    socketRef.current?.emit("leave_chat", chatRoomId)
  }

  const sendMessage = (chatRoomId: number, content: string) => {
    socketRef.current?.emit("send_message", { chatRoomId, content })
  }

  const typingStart = (chatRoomId: number) => {
    socketRef.current?.emit("typing_start", chatRoomId)
  }

  const stopTyping = (chatRoomId: number) => {
    socketRef.current?.emit("typing_stop", chatRoomId)
  }

  const markAsRead = (chatRoomId: number, messageIds: number[]) => {
    socketRef.current?.emit("mark_as_read", { chatRoomId, messageIds })
  }

  return {
    socket: socketRef.current,
    joinChat,
    leaveChat,
    sendMessage,
    typingStart,
    stopTyping,
    markAsRead,
    isConnected: socketRef.current?.connected || false,
  }
}
