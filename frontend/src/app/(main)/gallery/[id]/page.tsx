"use client"
import { getPhotosInGallery } from "@/services/photo"
import { ApiResponse, Gallery } from "@/types/interfaces"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

import Image from "next/image"
import InfiniteScroll from "react-infinite-scroll-component"

const GalleryPage = () => {
  // mock data
  const [photos, setPhotos] = useState<Gallery[]>([])
  const [page, setPage] = useState<number>(1)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true)
  const limit: number = 20
  const params = useParams()
  const id: number = parseInt(params.id as string)

  const fetchPhotos = async (
    pageNumber: number = page,
    isReset: boolean = false
  ) => {
    try {
      const response = await getPhotosInGallery(id, page, limit) // load next page
      const newPhotos: ApiResponse<Gallery[]> = response || []

      if (!newPhotos.data || newPhotos.data.length < limit) {
        setHasMore(false)
      }
      if (isReset) {
        // Reset photos for initial load
        setPhotos(newPhotos.data || [])
      } else {
        // Append for infinite scroll
        setPhotos((prev) => [...prev, ...(newPhotos.data || [])])
      }

      setPage(pageNumber + 1)
    } catch (error) {
      console.error("Failed to load photos", error)
    }
  }

  const resetAndFetchPhotos = () => {
    setPhotos([])
    setPage(1)
    setHasMore(true)
    setIsInitialLoad(false)
    fetchPhotos(1, true)
  }

  useEffect(() => {
    resetAndFetchPhotos()
  }, [id])

  return (
    <div className="py-4 px-2">
      <InfiniteScroll
        dataLength={photos.length}
        next={fetchPhotos}
        hasMore={hasMore}
        loader={<p className="text-center text-sm">Loading...</p>}
        endMessage={
          <p className="text-center text-sm text-gray-400 mt-8">
            No more Image :(
          </p>
        }>
        <div className="grid grid-cols-3 md:grid-cols-4 gap-0.5 md:gap-1 xl:gap-1.5">
          {photos.map((photo, index) => (
            <div
              key={index}
              className="relative aspect-square cursor-pointer rounded-lg overflow-hidden group">
              <div className="w-full h-full transition-transform duration-200 group-hover:scale-105">
                <Image
                  src={photo.imageUrl}
                  alt={photo.caption || "image"}
                  fill
                  className="object-cover "
                />
              </div>
              {photo.caption && (
                <div className="absolute bottom-2 left-2 right-2 glass-dark text-xs rounded-full">
                  <p className="line-clamp-1 text-center">{photo.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  )
}
export default GalleryPage
