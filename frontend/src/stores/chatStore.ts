import { create } from "zustand"
import { devtools } from "zustand/middleware"
import { Message, ChatListItem, User } from "@/types/interfaces"

interface TypingUser {
  userId: number
  username: string
  chatRoomId: number
}

interface ChatState {
  // Chat list
  chatList: ChatListItem[]
  setChatList: (chatList: ChatListItem[]) => void
  updateChatListItem: (
    chatRoomId: number,
    updates: Partial<ChatListItem>
  ) => void

  // Current chat
  currentChatId: number | null
  setCurrentChatId: (chatRoomId: number | null) => void

  // Messages
  messages: Record<number, Message[]>
  addMessages: (chatRoomId: number, message: Message) => void
  setMessages: (chatRoomId: number, messages: Message[]) => void
  updateMessageReadStatus: (chatRoomId: number, messageIds: number[]) => void

  // Typing users
  typingUsers: TypingUser[]
  addTypingUser: (user: TypingUser) => void
  removeTypingUser: (userId: number, chatRoomId: number) => void

  // Unread counts
  unreadCounts: Record<number, number>
  setUnreadCount: (chatRoomId: number, count: number) => void
  incrementUnreadCount: (chatRoomId: number) => void
  decrementUnreadCount: (chatRoomId: number) => void
  resetUnreadCount: (chatRoomId: number) => void

  //Online users
  onlineUsers: Set<number>
  setUserOnline: (userId: number) => void
  setUserOffline: (userId: number) => void

  // Loading state
  isLoadingMessages: boolean
  setIsLoadingMessages: (loading: boolean) => void
  isLoadingChatList: boolean
  setIsLoadingChatList: (loading: boolean) => void
}

export const useChatStore = create<ChatState>()(
  devtools(
    (set, get) => ({
      // Chat list
      chatList: [],
      setChatList: (chatList) => set({ chatList }),
      updateChatListItem: (chatRoomId, updates) =>
        set((state) => ({
          chatList: state.chatList.map((item) =>
            item.chatRoomId === chatRoomId ? { ...item, ...updates } : item
          ),
        })),

      // Current chat
      currentChatId: null,
      setCurrentChatId: (chatId) => set({ currentChatId: chatId }),

      // Messages
      messages: {},
      addMessages: (chatRoomId, message) =>
        set((state) => ({
          messages: {
            ...state.messages,
            [chatRoomId]: [...(state.messages[chatRoomId] || []), message],
          },
        })),
      setMessages: (chatRoomId, messages) =>
        set((state) => ({
          messages: {
            ...state.messages,
            [chatRoomId]: messages,
          },
        })),
      updateMessageReadStatus: (chatRoomId, messageIds) =>
        set((state) => ({
          messages: {
            ...state.messages,
            [chatRoomId]: (state.messages[chatRoomId] || []).map((msg) =>
              messageIds.includes(msg.id) ? { ...msg, isRead: true } : msg
            ),
          },
        })),

      // Typing indicators
      typingUsers: [],
      addTypingUser: (user) =>
        set((state) => ({
          typingUsers: state.typingUsers.some(
            (u) => u.userId === user.userId && u.chatRoomId === user.chatRoomId
          )
            ? state.typingUsers
            : [...state.typingUsers, user],
        })),
      removeTypingUser: (userId, chatRoomId) =>
        set((state) => ({
          typingUsers: state.typingUsers.filter(
            (u) => !(u.userId === userId && u.chatRoomId === chatRoomId)
          ),
        })),

      // Unread counts
      unreadCounts: {},
      setUnreadCount: (chatRoomId, count) =>
        set((state) => ({
          unreadCounts: {
            ...state.unreadCounts,
            [chatRoomId]: count,
          },
        })),
      incrementUnreadCount: (chatRoomId) =>
        set((state) => ({
          unreadCounts: {
            ...state.unreadCounts,
            [chatRoomId]: (state.unreadCounts[chatRoomId] || 0) + 1,
          },
        })),
      decrementUnreadCount: (chatRoomId) =>
        set((state) => ({
          unreadCounts: {
            ...state.unreadCounts,
            [chatRoomId]: Math.max(
              (state.unreadCounts[chatRoomId] || 0) - 1,
              0
            ),
          },
        })),
      resetUnreadCount: (chatRoomId) =>
        set((state) => ({
          unreadCounts: {
            ...state.unreadCounts,
            [chatRoomId]: 0,
          },
        })),

      // Online users
      onlineUsers: new Set(),
      setUserOnline: (userId) =>
        set((state) => ({
          onlineUsers: new Set([...state.onlineUsers, userId]),
        })),
      setUserOffline: (userId) =>
        set((state) => {
          const newSet = new Set(state.onlineUsers)
          newSet.delete(userId)
          return { onlineUsers: newSet }
        }),

      // Loading state
      isLoadingMessages: false,
      setIsLoadingMessages: (loading) => set({ isLoadingMessages: loading }),
      isLoadingChatList: false,
      setIsLoadingChatList: (loading) => set({ isLoadingChatList: loading }),
    }),
    {
      name: "chat-store",
    }
  )
)
