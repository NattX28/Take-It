"use client"

import { Gallery } from "@/types/interfaces"
import { useEffect, useState } from "react"
import Image from "next/image"

const FeedComponent = () => {
  const [photos, setPhotos] = useState<Gallery[]>([])

  const formatRelativeTime = (date: Date): string => {
    const now = new Date()
    const photoDate = date
    const diffInSeconds = Math.floor(
      (now.getTime() - photoDate.getTime()) / 1000
    )

    if (diffInSeconds < 60) return "just now"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 2592000)
      return `${Math.floor(diffInSeconds / 86400)}d ago`
    return `${Math.floor(diffInSeconds / 2592000)}mo ago`
  }

  useEffect(() => {
    const mockPhotos: Gallery[] = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      userId: i + 1,
      imageUrl: `https://picsum.photos/1080/1080?random=${i}`,
      caption: i % 3 === 0 ? `Beautiful moment ${i + 1}` : undefined,
      createdAt: new Date(),
      user: {
        id: i + 1,
        name: `User ${i + 1}`,
        username: `user${i + 1}`,
        email: `user${i + 1}@example.com`,
        createdAt: new Date(),
        lastActive: new Date(),
      },
      isPublic: true,
    }))
    setPhotos(mockPhotos)
  }, [])

  return (
    <div className="h-screen w-full">
      {photos.map((photo, index) => (
        <div
          key={index}
          className="h-screen snap-start flex flex-col justify-center items-center  text-white">
          <div className="relative aspect-square w-full max-w-md bg-gray-900 rounded-lg overflow-hidden">
            <Image
              src={photo.imageUrl}
              alt={photo.caption || `Photo by ${photo.user?.username}`}
              fill
              loading="lazy"
              className="object-cover"
            />
          </div>
          <div className="mt-4 px-4">
            <div className="flex items-center gap-2 justify-center">
              <p className="font-semibold text-md">{photo.user?.username}</p>
              <p className="text-white/70 text-sm">
                {formatRelativeTime(photo.createdAt)}
              </p>
            </div>
            {photo.caption && (
              <p className="text-white/70 text-sm mt-1">{photo.caption}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default FeedComponent
