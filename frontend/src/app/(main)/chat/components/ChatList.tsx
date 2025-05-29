"use client"
import { ScrollArea } from "@/components/ui/scroll-area"
import ChatItem from "./ChatItem"
import { useChatStore } from "@/stores/chatStore"
import { useSocketContext } from "@/contexts/SocketProvider"
import { useEffect } from "react"
import { getChatList } from "@/services/chat"
import { ApiResponse, ChatListItem } from "@/types/interfaces"
import { useAuthStore } from "@/stores/authStore"

const ChatList = () => {
  const {
    chatList,
    setChatList,
    setCurrentChatId,
    currentChatId,
    isLoadingChatList,
    setIsLoadingChatList,
    unreadCounts,
  } = useChatStore()
  const { user } = useAuthStore()
  const { socket } = useSocketContext() // ใช้ socket จาก context
  const userId = user?.id

  // Load chat list
  useEffect(() => {
    const loadChatList = async () => {
      setIsLoadingChatList(true)
      try {
        const response: ApiResponse<ChatListItem[]> = await getChatList()
        if (response.data) {
          setChatList(response.data)
        }
      } catch (error) {
        console.error("Failed to load chat list:", error)
      } finally {
        setIsLoadingChatList(false)
      }
    }

    loadChatList()
  }, [setChatList, setIsLoadingChatList])

  const handleChatItemClick = (chatRoomId: number) => {
    if (!socket) return

    // Leave current chat if any
    if (currentChatId && currentChatId !== chatRoomId) {
      socket.emit("leave_chat", currentChatId)
    }

    // Join new chat
    socket.emit("join_chat", chatRoomId)
    setCurrentChatId(chatRoomId)
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-Us", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  }

  if (isLoadingChatList) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <ScrollArea className="h-full mt-6">
      <div className="flex flex-col gap-3 p-1">
        {chatList.map((chatItem) => {
          const otherParticipant = chatItem.chatRoom.participants.find(
            (p) => p.user.id !== userId
          )?.user

          const unreadCount = unreadCounts[chatItem.chatRoomId] || 0

          return (
            <div
              key={chatItem.chatRoomId}
              onClick={() => handleChatItemClick(chatItem.chatRoomId)}
              className={`cursor-pointer ${
                currentChatId === chatItem.chatRoomId
                  ? "ring-2 ring-blue-500"
                  : ""
              }`}>
              <ChatItem
                name={otherParticipant?.username || "Unknow User"}
                lastMessage={
                  chatItem.chatRoom.lastMessage?.content || "No messages yet"
                }
                unread={unreadCount > 0}
                unreadCount={unreadCount}
                time={
                  chatItem.chatRoom.lastMessage
                    ? formatTime(
                        chatItem.chatRoom.lastMessage.createdAt.toString()
                      )
                    : ""
                }
              />
            </div>
          )
        })}
      </div>
    </ScrollArea>
  )
}
export default ChatList
