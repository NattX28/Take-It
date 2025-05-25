"use client"

import { Gallery } from "@/types/interfaces"
import { useEffect, useState, useRef, useCallback } from "react"
import Image from "next/image"
import { Icon } from "@iconify/react"
import { getFeedPhotos } from "@/services/photo"

const FeedComponent = () => {
  const [photos, setPhotos] = useState<Gallery[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const formatRelativeTime = (date: Date): string => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return "just now"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 2592000)
      return `${Math.floor(diffInSeconds / 86400)}d ago`
    return `${Math.floor(diffInSeconds / 2592000)}mo ago`
  }

  const loadMorePhotos = useCallback(async () => {
    if (loading || !hasMore) return

    setLoading(true)
    setError(null)

    try {
      const response = await getFeedPhotos(page, 10)
      if (response.status === 200 && response.data) {
        const newPhotos = response.data

        // If retrive data less limit => all gone
        if (newPhotos.length < 10) {
          setHasMore(true)
        }

        setPhotos((prev) => [...prev, ...newPhotos])
        setPage((prev) => prev + 1)
      } else {
        setError(response.message || "Failed to load photos")
        setHasMore(false)
      }
    } catch (error) {
      console.error("Error loading photos:", error)
      setError("Something went wrong while loading photos")
      setHasMore(false)
    } finally {
      setLoading(false)
    }
  }, [loading, hasMore, page])

  // Handle scroll to load more
  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const container = e.target as HTMLDivElement
      const { scrollTop, scrollHeight, clientHeight } = container

      // Load more when near bottom (80% scrolled)
      if (
        scrollHeight - scrollTop <= clientHeight * 1.2 &&
        !loading &&
        hasMore
      ) {
        loadMorePhotos()
      }
    },
    [loadMorePhotos, loading, hasMore]
  )

  // Initialize with first batch
  useEffect(() => {
    loadMorePhotos()
  }, [])

  // Error state(error and empty)
  if (error && photos.length === 0) {
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <div className="text-center">
          <Icon
            icon="ph:warning-circle"
            className="text-red-500 text-4xl mb-4 mx-auto"
          />
          <p className="text-white/70 mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null)
              setPage(1)
              setPhotos([])
              setHasMore(true)
              loadMorePhotos()
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen w-full">
      <div
        ref={containerRef}
        className="h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
        onScroll={handleScroll}
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}>
        {photos.map((photo, index) => (
          <div
            key={`${photo.id}-${index}`}
            className="h-screen snap-start snap-always flex flex-col justify-center items-center px-4 relative">
            {/* Photo container */}
            <div className="relative aspect-square w-full max-w-lg bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={photo.imageUrl}
                alt={photo.caption || `Photo by ${photo.user?.username}`}
                fill
                loading="lazy"
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />

              {/* Overlay gradient for better text readability */}
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent" />

              {/* User info at bottom */}
              <div className="absolute bottom-3 left-3 right-3">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-white text-sm">
                    {photo.user?.username}
                  </p>
                  <p className="text-white/70 text-xs">
                    {formatRelativeTime(new Date(photo.createdAt))}
                  </p>
                </div>

                {photo.caption && (
                  <p className="text-white/90 text-sm mt-1 leading-relaxed">
                    {photo.caption}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {loading && (
          <div className="h-screen snap-start flex justify-center items-center">
            <Icon
              icon="eos-icons:loading"
              width="48"
              height="48"
              className="animate-spin text-white"
            />
          </div>
        )}

        {/* End message */}
        {!hasMore && photos.length > 0 && (
          <div className="h-screen snap-start flex justify-center items-center">
            <div className="text-center">
              <Icon
                icon="ph:check-circle"
                className="text-white text-4xl mb-4 mx-auto"
              />
              <p className="text-white/70">You're all caught up!</p>
              <p className="text-white/50 text-sm mt-2">
                No more photos to show
              </p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && photos.length === 0 && !error && (
          <div className="h-screen snap-start flex justify-center items-center">
            <div className="text-center">
              <Icon
                icon="ph:camera-slash"
                className="text-white/50 text-4xl mb-4 mx-auto"
              />
              <p className="text-white/70">No Photos in your feed</p>
              <p className="text-white/50 text-sm mt-2">
                Follow some friends to see their photos here
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default FeedComponent
