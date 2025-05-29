import React, { createContext, useContext, useEffect, useRef } from "react"
import { io, Socket } from "socket.io-client"
import { useChatStore } from "@/stores/chatStore"
import { Message } from "@/types/interfaces"

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

interface SocketContextType {
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | null
  isConnected: boolean
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
})

export const useSocketContext = () => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error("UseSocketContext must be used within a SocketProvider")
  }
  return context
}

interface SocketProviderProps {
  children: React.ReactNode
  userId?: number
}

export const SocketProvider: React.FC<SocketProviderProps> = ({
  children,
  userId,
}) => {
  const socketRef = useRef<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>(null)
  const [isConnected, setIsConnected] = React.useState(false)
  const {
    addMessage,
    updateChatListItem,
    chatList,
    currentChatId,
    incrementUnreadCount,
    addTypingUser,
    removeTypingUser,
    updateMessageReadStatus,
    setUserOnline,
    setUserOffline,
  } = useChatStore()

  useEffect(() => {
    // Initialize socket connection
    const socket = io(
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000",
      {
        withCredentials: true,
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      }
    )

    socketRef.current = socket

    // Connection events
    socket.on("connect", () => {
      console.log("Connected to server")
      setIsConnected(true)
    })

    socket.on("disconnect", () => {
      console.log("Disconnected from server")
      setIsConnected(false)
    })

    socket.on("reconnect", () => {
      console.log("Reconnected to server")
      setIsConnected(true)
    })

    // Chat events
    socket.on("message_received", (message) => {
      console.log("Message received: ", message)

      // Add message to store
      addMessage(message.chatRoomId, message)

      // Update chat list with last message
      const chatItem = chatList.find((c) => c.chatRoomId === message.chatRoomId)
      if (chatItem) {
        updateChatListItem(message.chatRoomId, {
          chatRoom: {
            ...chatItem.chatRoom,
            lastMessage: {
              id: message.id,
              content: message.content,
              createdAt: message.createdAt,
              userId: message.userId,
              user: {
                username: message.user.username,
              },
            },
          },
        })
      }

      // Increment unread count if not current chat and not own message
      if (currentChatId !== message.chatRoomId && message.userId !== userId) {
        incrementUnreadCount(message.chatRoomId)
      }
    })

    socket.on("user_joined", (data) => {
      console.log("User joined: ", data)
      if (data.userId !== userId) {
        setUserOnline(data.userId)
      }
    })

    socket.on("user_left", (data) => {
      console.log("User left:", data)
      if (data.userId !== userId) {
        setUserOffline(data.userId)
      }
    })

    socket.on("user_typing", (data) => {
      if (data.userId !== userId) {
        addTypingUser(data)
      }
    })

    socket.on("user_stopped_typing", (data) => {
      if (data.userId !== userId) {
        removeTypingUser(data.userId, data.chatRoomId)
      }
    })

    socket.on("messages_read", (data) => {
      updateMessageReadStatus(data.chatRoomId, data.messageIds)
    })

    socket.on("error", (error) => {
      console.error("Socket error:", error)
      // You can show a toast notification here
    })

    return () => {
      socket.disconnect()
    }
  }, [userId])

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, isConnected }}>
      {children}
    </SocketContext.Provider>
  )
}
export default SocketProvider
