"use client"
import { useState, useEffect, useRef } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useChatStore } from "@/stores/chatStore"
import { useSocketContext } from "@/contexts/SocketProvider"
import { getChatMessages } from "@/services/chat"
import { ApiResponse, Message } from "@/types/interfaces"
import { Icon } from "@iconify/react"

interface ChatWindowProps {
  currentUserId: number
}

const ChatWindow = ({ currentUserId }: ChatWindowProps) => {
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const { socket } = useSocketContext() // ใช้ socket จาก context แทน

  const {
    currentChatId,
    messages,
    setMessages,
    addMessage,
    isLoadingMessages,
    setIsLoadingMessages,
    typingUsers,
    resetUnreadCount,
    updateMessageReadStatus,
  } = useChatStore()

  // Load messages when chat changes
  useEffect(() => {
    if (currentChatId) {
      loadMessages(currentChatId)
      resetUnreadCount(currentChatId)
    }
  }, [currentChatId])

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages, currentChatId])

  const loadMessages = async (chatRoomId: number) => {
    setIsLoadingMessages(true)
    const page: number = 1
    const limit: number = 50
    try {
      const response: ApiResponse<{
        messages: Message[]
        pagination: {
          page: number
          limit: number
          total: number
          hasMore: boolean
        }
      }> = await getChatMessages(chatRoomId, page, limit)

      if (response.data) {
        setMessages(chatRoomId, response.data.messages)

        // Mark all messages as read
        const unreadMessages = response.data.messages
          .filter((msg: Message) => !msg.isRead && msg.userId !== currentUserId)
          .map((msg: Message) => msg.id)

        if (unreadMessages.length > 0 && socket) {
          socket.emit("mark_as_read", {
            chatRoomId,
            messageIds: unreadMessages,
          })
        }
      }
    } catch (error) {
      console.error("Failed to load messages:", error)
    } finally {
      setIsLoadingMessages(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = () => {
    if (!newMessage.trim() || !currentChatId || !socket) return

    socket.emit("send_message", {
      chatRoomId: currentChatId,
      content: newMessage.trim(),
    })
    setNewMessage("")

    // Stop typing indicator
    if (isTyping) {
      socket.emit("typing_stop", currentChatId)
      setIsTyping(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value)

    if (!currentChatId || !socket) return

    // Start typing indicator
    if (!isTyping) {
      socket.emit("typing_start", currentChatId)
      setIsTyping(true)
    }

    // Reset typing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = setTimeout(() => {
      if (isTyping) {
        socket.emit("typing_stop", currentChatId)
        setIsTyping(false)
      }
    }, 3000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const isToday = date.toDateString() === now.toDateString()

    if (isToday) {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    }
  }

  const currentChatMessages = currentChatId ? messages[currentChatId] || [] : []
  const currentChatTypingUsers = typingUsers.filter(
    (user) => user.chatRoomId === currentChatId
  )

  if (!currentChatId) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <h3 className="text-lg font-medium mb-2">No chat selected</h3>
          <p>Choose a conversation to start messaging</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Message Area */}
      <ScrollArea className="flex-1 p-4">
        {isLoadingMessages ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {currentChatMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.userId === currentUserId
                    ? "justify-end"
                    : "justify-start"
                }`}>
                <div
                  className={`max-w-[70%] px-4 py-2 rounded-lg ${
                    message.userId === currentUserId
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-900"
                  }`}>
                  <p className="break-words">{message.content}</p>
                  <div
                    className={`text-xs mt-1 ${
                      message.userId === currentUserId
                        ? "text-blue-100"
                        : "text-gray-500"
                    }`}>
                    {formatMessageTime(message.createdAt.toString())}
                    {message.userId === currentUserId && (
                      <span className="ml-2">
                        {message.isRead ? "✓✓" : "✓"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {currentChatTypingUsers.length > 0 && (
              <div className="flex justify-start">
                <div className="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg">
                  <div className="flex items-center space-x-1">
                    <span className="text-sm">
                      {currentChatTypingUsers.map((u) => u.username).join(", ")}{" "}
                      typing
                    </span>
                    <div className="flex space-x-1">
                      <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce"></div>
                      <div
                        className="w-1 h-1 bg-gray-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}></div>
                      <div
                        className="w-1 h-1 bg-gray-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>

      {/* Message Input */}
      <div className="border-t p-4">
        <div className="flex items-center space-x-2">
          <Input
            value={newMessage}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1"
            disabled={!currentChatId}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || !currentChatId}>
            <Icon icon="material-symbols:send-rounded" width="24" height="24" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ChatWindow
