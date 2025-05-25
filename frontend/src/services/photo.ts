import { ApiResponse, Gallery } from "@/types/interfaces"
import { api } from "./api"
const BASE_URL_GALLERY: string = "/gallery"

export const uploadPhoto = async (
  imageFile: File,
  caption?: string
): Promise<ApiResponse<Gallery>> => {
  try {
    const formData = new FormData()
    formData.append("image", imageFile)

    if (caption) formData.append("caption", caption)

    // public/private setting
    formData.append("isPublic", "true")

    const response = await api.post(`${BASE_URL_GALLERY}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    return response.data
  } catch (error) {
    console.error("Upload error:", error)
    throw error
  }
}

// get photos in gallery with infinit scroll
export const getPhotosInGallery = async (
  id: number,
  page: number = 1,
  limit: number = 20
): Promise<ApiResponse<Gallery[]>> => {
  try {
    const response = await api.get(
      `${BASE_URL_GALLERY}/${id}?page=${page}&limit=${limit}`
    )
    return response.data
  } catch (error) {
    console.error("Get photos in gallery error:", error)
    throw error
  }
}

export const getFeedPhotos = async (
  page: number = 1,
  limit: number = 10
): Promise<ApiResponse<Gallery[]>> => {
  try {
    const response = await api.get(`feed?page=${page}&limit=${limit}`)

    return response.data
  } catch (error) {
    console.error("Get feed photos error:", error)
    throw error
  }
}
