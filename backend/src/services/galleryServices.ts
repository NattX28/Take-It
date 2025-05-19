import cloudinary from "cloudinary"
import { Gallery } from "../libs/interfaces"
import fs from "fs"
import prisma from "../libs/prisma"

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export const createGallery = async (
  userId: number,
  file: Express.Multer.File,
  caption: string | null,
  isPublic: boolean = true
): Promise<Gallery | null> => {
  // upload to cloudinary first
  const cloudinaryResponse = await cloudinary.v2.uploader.upload(file.path, {
    folder: "take-it-gallery",
    transformation: [
      {
        width: 1080,
        height: 1080,
        crop: "limit",
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
