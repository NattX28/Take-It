"use client"
import { useEffect, useState } from "react"
import { SocketProvider } from "@/contexts/SocketProvider"
import { useAuthStore } from "@/stores/authStore"
import { useChatStore } from "@/stores/chatStore"
import ChatList from "./ChatList"
import ChatWindow from "./ChatWindow"

const ChatPage = () => {
  const { user, isAuthenticated, isLoading } = useAuthStore()
  const { currentChatId } = useChatStore()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">
            Authentication required
          </h2>
          <p className="text-gray-600">Please log in to access the chat.</p>
        </div>
      </div>
    )
  }

  return (
    <SocketProvider userId={user.id}>
      <div className="h-screen flex bg-gray-50">
        {/* Sidebar - Chat List */}
        <div
          className={`
                ${
                  isMobile
                    ? currentChatId
                      ? "hidden"
                      : "w-full"
                    : "w-1/3 border-r"
                } bg-white flex flex-col`}>
          <div className="p-4 border-b bg-white">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold">Messages</h1>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {user.username.substring(0, 2).toUpperCase()}
                  </div>
                  <span className="text-sm text-gray-600">{user.username}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <ChatList />
          </div>
        </div>

        {/* Main chat Area */}
        <div
          className={`
            ${
              isMobile ? (currentChatId ? "w-full" : "hidden") : "flex-1"
            } flex flex-col bg-white
            `}>
          {currentChatId ? (
            <div>
              {/* Chat Header */}
              <div className="p-4 border-b bg-white flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {isMobile && (
                    <button
                      onClick={() =>
                        useChatStore.getState().setCurrentChatId(null)
                      }
                      className="p-2 hover:bg-gray-100 rounded-full">
                      ←
                    </button>
                  )}
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                      CH
                    </div>
                    <div>
                      <h2 className="font-medium">Chat Room {currentChatId}</h2>
                      <p className="text-sm text-gray-500">Online</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 hover:bg-gray-100 rounded-full">
                    📞
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full">
                    📹
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full">
                    ⚙️
                  </button>
                </div>
              </div>

              {/* Chat Window */}
              <div className="flex-1 overflow-hidden">
                <ChatWindow currentUserId={user.id} />
              </div>
            </div>
          ) : (
            <div className="flex-1 flex-items-center justify-center text-gray-500">
              <div className="text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  💬
                </div>
                <h3 className="text-lg font-medium mb-2">
                  Select a conversation
                </h3>
                <p className="text-gray-400">
                  Choose from your existing conversations or start a new one
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </SocketProvider>
  )
}
export default ChatPage
