import { Request, Response } from "express"
import { ApiResponse, Gallery } from "../libs/interfaces"
import * as feedServices from "../services/feedServices"

export const getFeedPhotos = async (req: Request, res: Response) => {
  const userId = req.user?.id

  if (!userId) {
    res.status(401).json({
      status: 401,
      message: "Unauthorized",
      error: "User ID is required",
    } as ApiResponse<null>)
    return
  }

  const page: number = parseInt(req.query.page as string) || 1
  const limit: number = parseInt(req.query.limit as string) || 10

  try {
    const photos = await feedServices.getFeedphotos(userId, page, limit)

    if (!photos) {
      res.status(500).json({
        status: 500,
        message: "Internal server error",
        error: "Failed to get feed photos",
      } as ApiResponse<null>)
    }

    res.status(200).json({
      status: 200,
      message: "Get feed photos successfully",
      data: photos,
    } as ApiResponse<Gallery[]>)
  } catch (error) {
    console.error("Error getting feed photos:", error)
    res.status(500).json({
      status: 500,
      message: "Internal server error",
      error: "Something went wrong while getting feed photos",
    } as ApiResponse<null>)
    return
  }
}
