import { Gallery } from "../libs/interfaces"
import prisma from "../libs/prisma"

export const getFeedphotos = async (
  userId: number,
  page: number,
  limit: number
): Promise<Gallery[] | null> => {
  const skip: number = (page - 1) * limit

  try {
    // Get user's friends (accepted friendships)
    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [
          { userId1: userId, status: "accepted" },
          { userId2: userId, status: "accepted" },
        ],
      },
    })

    // Extract friend IDs
    const friendIds = friendships.map((friendship) =>
      friendship.userId1 === userId ? friendship.userId2 : friendship.userId1
    )

    // Get photos from:
    // 1. User's own photos (public and private)
    // 2. Friends' public photos
    // 3. Photos shared with the user

    const photos = await prisma.gallery.findMany({
      where: {
        OR: [
          // User's own photos (all photos)
          {
            userId: userId,
          },
          // friend's public photos
          {
            userId: { in: friendIds },
            isPublic: true,
          },
          // Photos shared with this user (excluding user's own photos to avoid duplicates)
          {
            userId: { not: userId },
            sharedWith: {
              some: {
                sharedWithId: userId,
              },
            },
          },
        ],
      },
      include: {
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
    })

    return photos as Gallery[]
  } catch (error) {
    console.error("Error getting feed photos:", error)
    return null
  }
}
