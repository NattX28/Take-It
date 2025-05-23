import cloudinary from "../configs/cloudinaryConfig"
import { Gallery } from "../libs/interfaces"
import fs from "fs"
import prisma from "../libs/prisma"

export const createGallery = async (
  userId: number,
  file: Express.Multer.File,
  caption: string | null,
  isPublic: boolean = true
): Promise<Gallery | null> => {
  // upload to cloudinary first
  const cloudinaryResponse = await cloudinary.uploader.upload(file.path, {
    folder: "take-it-gallery",
    resource_type: "image",
    transformation: [
      {
        width: 1080,
        height: 1080,
        crop: "limit",
        quality: "auto:good",
      },
    ],
  })

  // Remove temporaty file after successful upload
  fs.unlinkSync(file.path)

  // Save the gallery in DB
  const gallery = await prisma.gallery.create({
    data: {
      userId,
      imageUrl: cloudinaryResponse.secure_url,
      caption,
      isPublic,
    },
  })

  return gallery as Gallery
}

export const getPhotosGallery = async (
  requesterId: number, // who want to get data
  targetUserId: number, // data owner
  page: number,
  limit: number
): Promise<Gallery[] | null> => {
  const skip = (page - 1) * limit

  // if watch self
  if (requesterId === targetUserId) {
    return prisma.gallery.findMany({
      where: {
        userId: targetUserId,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    })
  }

  // if watch others
  return prisma.gallery.findMany({
    where: {
      userId: targetUserId,
      OR: [
        { isPublic: true },
        {
          sharedWith: {
            some: {
              sharedWithId: requesterId,
            },
          },
        },
      ],
    },
    orderBy: { createdAt: "desc" },
    skip,
    take: limit,
  })
}
