import { ChatListItem, ChatRoom, Message } from "../libs/interfaces"
import prisma from "../libs/prisma"

export const getChatList = async (userId: number): Promise<ChatListItem[]> => {
  const chatParticipants = await prisma.chatRoomParticipant.findMany({
    where: {
      userId,
    },
    select: {
      chatRoomId: true,
      joinedAt: true,
    },
    orderBy: {
      joinedAt: "desc",
    },
  })

  if (!chatParticipants || chatParticipants.length === 0) {
    return []
  }

  const chatRoomIds = chatParticipants.map(
    (participant) => participant.chatRoomId
  )

  const chatRooms = await prisma.chatRoom.findMany({
    where: {
      id: { in: chatRoomIds },
    },
    select: {
      id: true,
      createdAt: true,
      participants: {
        select: {
          userId: true,
          user: {
            select: {
              id: true,
              username: true,
              profilePicture: true,
              lastActive: true,
            },
          },
        },
      },
      messages: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
        select: {
          id: true,
          content: true,
          createdAt: true,
          userId: true,
          user: {
            select: {
              username: true,
            },
          },
        },
      },
    },
  })

  const chatList: ChatListItem[] = chatParticipants.map((participant) => {
    const chatRoom = chatRooms.find(
      (room) => room.id === participant.chatRoomId
    )!

    return {
      chatRoomId: participant.chatRoomId,
      joinedAt: participant.joinedAt,
      chatRoom: {
        id: chatRoom.id,
        createdAt: chatRoom.createdAt,
        participants: chatRoom.participants.map((p) => ({
          user: {
            ...p.user,
            profilePicture: p.user.profilePicture ?? undefined,
          },
        })),
        lastMessage: chatRoom.messages[0] || null,
      },
    }
  })

  return chatList
}

export const createChatRoom = async (
  userId1: number,
  userId2: number
): Promise<ChatRoom> => {
  // Check if chat room already exits between these users
  const existingChatParticipant = await prisma.chatRoomParticipant.findFirst({
    where: {
      userId: userId1,
      chatRoom: {
        participants: {
          some: {
            userId: userId2,
          },
        },
      },
    },
    select: {
      chatRoomId: true,
    },
  })

  if (existingChatParticipant) {
    const existingChatRoom = await prisma.chatRoom.findUnique({
      where: {
        id: existingChatParticipant.chatRoomId,
      },
      select: {
        id: true,
        createdAt: true,
        participants: {
          select: {
            chatRoomId: true,
            userId: true,
            joinedAt: true,
            user: {
              select: {
                id: true,
                username: true,
                email: true,
                profilePicture: true,
                createdAt: true,
                lastActive: true,
              },
            },
            chatRoom: {
              select: {
                id: true,
                createdAt: true,
              },
            },
          },
        },
      },
    })

    return existingChatRoom as ChatRoom
  }

  // create new chat room with participants
  const newChatRoom = await prisma.chatRoom.create({
    data: {
      participants: {
        create: [{ userId: userId1 }, { userId: userId2 }],
      },
    },
    select: {
      id: true,
      createdAt: true,
      participants: {
        select: {
          chatRoomId: true,
          userId: true,
          joinedAt: true,
          user: {
            select: {
              id: true,
              username: true,
              email: true,
              profilePicture: true,
              createdAt: true,
              lastActive: true,
            },
          },
          chatRoom: {
            select: {
              id: true,
              createdAt: true,
            },
          },
        },
      },
    },
  })

  return newChatRoom as ChatRoom
}

export const getChatMessages = async (
  chatRoomId: number,
  userId: number,
  page: number = 1,
  limit: number = 50
): Promise<{
  messages: Message[]
  pagination: {
    page: number
    limit: number
    total: number
    hasMore: boolean
  }
}> => {
  // Verify user is participant in this chat room
  const participant = await prisma.chatRoomParticipant.findUnique({
    where: {
      chatRoomId_userId: {
        chatRoomId,
        userId,
      },
    },
  })

  if (!participant) {
    throw new Error("User is not a participant in this chat room")
  }

  const skip: number = (page - 1) * limit

  const [messages, totalMessages] = await Promise.all([
    prisma.message.findMany({
      where: {
        chatRoomId,
      },
      select: {
        id: true,
        chatRoomId: true,
        userId: true,
        content: true,
        createdAt: true,
        isRead: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            profilePicture: true,
            createdAt: true,
            lastActive: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    }),
    prisma.message.count({
      where: {
        chatRoomId,
      },
    }),
  ])

  return {
    messages: messages.reverse() as Message[], // Reverse to show oldest first
    pagination: {
      page,
      limit,
      total: totalMessages,
      hasMore: skip + messages.length < totalMessages,
    },
  }
}

export const sendMessage = async (
  chatRoomId: number,
  userId: number,
  content: string
): Promise<Message> => {
  // Verify user is participant in this chat room
  const participant = await prisma.chatRoomParticipant.findUnique({
    where: {
      chatRoomId_userId: {
        chatRoomId,
        userId,
      },
    },
  })

  if (!participant) {
    throw new Error("User is not a participant in this chat room")
  }

  const message = await prisma.message.create({
    data: {
      chatRoomId,
      userId,
      content,
    },
    select: {
      id: true,
      chatRoomId: true,
      userId: true,
      content: true,
      createdAt: true,
      isRead: true,
      user: {
        select: {
          id: true,
          username: true,
          email: true,
          profilePicture: true,
          createdAt: true,
          lastActive: true,
        },
      },
    },
  })

  return message as Message
}
