import { ApiResponse, Gallery } from "@/types/interfaces"
import { api } from "./api"
const BASE_URL_GALLERY = "/gallery"

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
