import { Request, Response } from "express"
import * as galleryServices from "../services/galleryServices"
import { ApiResponse, Gallery } from "../libs/interfaces"

export const uploadPhoto = async (req: Request, res: Response) => {
  const userId = req.user?.id

  if (!userId) {
    res.status(401).json({
      status: 401,
      message: "Unauthorized",
      error: "User ID is required",
    } as ApiResponse<null>)
    return
  }

  try {
    // req.file is populated by multer middleware
    if (!req.file) {
      res.status(400).json({
        status: 400,
        message: "Bad request",
        error: "No file upload",
      } as ApiResponse<null>)
      return
    }

    const caption = req.body.caption || null
    const isPublic = req.body.isPublic === "true"

    // upload image to Cloudinary and save to DB
    const gallery = await galleryServices.createGallery(
      userId,
      req.file,
      caption,
      isPublic
    )

    if (!gallery) {
      res.status(500).json({
        status: 500,
        message: "Internal server error",
        error: "Failed to create gallery",
      } as ApiResponse<null>)
      return
    }

    res.status(201).json({
      status: 201,
      message: "Gallery created successfully",
      data: gallery,
    } as ApiResponse<Gallery>)
  } catch (error) {
    console.error("Error uploading photo:", error)
    res.status(500).json({
      status: 500,
      message: "Internal server error",
      error: "Something went wrong while uploading photo",
    } as ApiResponse<null>)
    return
  }
}

// get photos in gallery with infinit scroll
export const getPhotosGallery = async (req: Request, res: Response) => {
  const targetUserId: number = parseInt(req.params.id) // user that we want to watch
  const requesterId = req.user?.id // who want to watch

  if (!targetUserId) {
    res.status(400).json({
      status: 400,
      message: "Bad request",
      error: "Target user id is required",
    } as ApiResponse<null>)
    return
  }

  if (!requesterId) {
    res.status(400).json({
      status: 400,
      message: "Bad request",
      error: "Requester id is required",
    } as ApiResponse<null>)
    return
  }
  const page: number = parseInt(req.query.page as string) || 1
  const limit: number = parseInt(req.query.limit as string) || 20

  try {
    const gallery = await galleryServices.getPhotosGallery(
      requesterId,
      targetUserId,
      page,
      limit
    )
    if (!gallery) {
      res.status(500).json({
        status: 500,
        message: "Internal server error",
        error: "Failed to get photos in gallery",
      } as ApiResponse<null>)
      return
    }

    res.status(201).json({
      status: 201,
      message: "Get photos in gallery successfully",
      data: gallery,
    } as ApiResponse<Gallery[]>)
  } catch (error) {
    console.error("Error uploading photo:", error)
    res.status(500).json({
      status: 500,
      message: "Internal server error",
      error: "Something went wrong while getting photos in gallery",
    } as ApiResponse<null>)
    return
  }
}
