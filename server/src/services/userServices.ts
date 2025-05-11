import { Friendship, User } from "../libs/interfaces"
import prisma from "../libs/prisma"

export const addFriend = async (
  requesterId: number,
  recieverId: number
): Promise<Friendship | null> => {
  // Check if the requester and reciever exist
  const requester = await prisma.user.findUnique({
    where: {
      id: requesterId,
    },
  })

  const reciever = await prisma.user.findUnique({
    where: {
      id: recieverId,
    },
  })

  if (!requester || !reciever) return null

  // Check if freindship already exists
  const existingFriendship = await prisma.friendship.findFirst({
    where: {
      OR: [
        { userId1: requesterId, userId2: recieverId },
        { userId1: recieverId, userId2: requesterId },
      ],
    },
  })

  if (existingFriendship) return null

  // Create new friendship with 'pending' status
  const friendship = await prisma.friendship.create({
    data: {
      userId1: recieverId,
      userId2: requesterId,
      status: "pending",
    },
  })

  return friendship as Friendship
}

export const acceptFriendRequest = async (
  currentUserId: number,
  requesterId: number
): Promise<Friendship | null> => {
  const friendship = await prisma.friendship.findFirst({
    where: {
      OR: [
        { userId1: currentUserId, userId2: requesterId, status: "pending" },
        { userId1: requesterId, userId2: currentUserId, status: "pending" },
      ],
    },
  })

  if (!friendship) return null

  const updatedFriendship = await prisma.friendship.update({
    where: {
      id: friendship.id,
    },
    data: {
      status: "accepted",
    },
  })

  return updatedFriendship as Friendship
}

export const rejectFriendRequest = async (
  currentUserId: number,
  requesterId: number
): Promise<Friendship | null> => {
  const friendship = await prisma.friendship.findFirst({
    where: {
      OR: [
        { userId1: currentUserId, userId2: requesterId, status: "pending" },
        { userId1: requesterId, userId2: currentUserId, status: "pending" },
      ],
    },
  })

  // Check if friendship exists
  if (!friendship) return null

  // wait for noti later

  const deletedFriendship = await prisma.friendship.delete({
    where: { id: friendship.id },
  })

  return deletedFriendship as Friendship
}

export const getPendingFriendRequests = async (userId: number) => {
  const pendingRequests = await prisma.friendship.findMany({
    where: {
      OR: [
        { userId1: userId, status: "pending" },
        { userId2: userId, status: "pending" },
      ],
    },
    include: {
      userOne: {
        select: {
          id: true,
          username: true,
          profilePicture: true,
        },
      },
      userTwo: {
        select: {
          id: true,
          username: true,
          profilePicture: true,
        },
      },
    },
  })

  // Seperate incoming and outgoing requests
  const incoming = pendingRequests
    .filter((friendship) => friendship.userId2 === userId)
    .map((friendship) => ({
      friendshipId: friendship.id,
      user: friendship.userOne,
    }))

  const outgoing = pendingRequests
    .filter((friendship) => friendship.userId1 === userId)
    .map((friendship) => ({
      friendshipId: friendship.id,
      user: friendship.userTwo,
    }))

  return { incoming, outgoing }
}

export const getFriends = async (userId: number): Promise<User[]> => {
  // find both sides of friendship
  const friendship = await prisma.friendship.findMany({
    where: {
      OR: [
        { userId1: userId, status: "accepted" },
        { userId2: userId, status: "accepted" },
      ],
    },
  })

  // Extract friend IDs
  const friendIds = friendship.map((friendship) =>
    friendship.userId1 === userId ? friendship.userId2 : friendship.userId1
  )

  const friends = await prisma.user.findMany({
    where: {
      id: { in: friendIds },
    },
    select: {
      id: true,
      username: true,
      email: true,
      profilePicture: true,
      createdAt: true,
      lastActive: true,
    },
  })

  return friends as User[]
}
