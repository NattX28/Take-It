"use client"

import { CameraConsoleProps } from "@/types/interfaces"
import { Icon } from "@iconify/react"
import Link from "next/link"

const CameraConsole = ({
  isCaptureMode,
  hasMultipleCameras,
  isCameraOn,
  isUploading = false,
  onTakePhoto,
  onCancle,
  onUpload,
  onToggleCaption,
  onSwitchCamera,
  onStartCamera,
}: CameraConsoleProps) => {
  return (
    <div className="flex justify-around items-center w-full glass rounded-full p-3 shadow-md transition-all duration-300 ease-in-out transform">
      {isCaptureMode ? (
        // Show post-capture controls
        <>
          <button
            onClick={onCancle}
            disabled={isUploading}
            className="flex flex-col items-center transition-transform duration-200 hover:scale-110">
            <Icon
              icon="material-symbols:cancel-outline-rounded"
              width="48"
              height="48"
              className={isUploading ? "text-gray-400" : ""}
            />
          </button>

          <button
            onClick={onUpload}
            disabled={isUploading}
            className="flex flex-col items-center transition-transform duration-200 hover:scale-110">
            {isUploading ? (
              <Icon
                icon="eos-icons:loading"
                width="64"
                height="64"
                className="animate-spin"
              />
            ) : (
              <Icon
                icon="mingcute:send-fill"
                width="64"
                height="64"
                style={{ color: "#ff6d3a" }}
              />
            )}
          </button>

          <button
            onClick={onToggleCaption}
            disabled={isUploading}
            className="flex flex-col items-center transition-transform duration-200 hover:scale-110">
            <Icon
              icon="solar:text-circle-bold-duotone"
              width="48"
              height="48"
              className={isUploading ? "text-gray-400" : ""}
            />
          </button>
        </>
      ) : (
        // Show camera controls
        <>
          <Link href={`/gallery`}>
            <button className="flex flex-col items-center transition-transform duration-200 hover:scale-110">
              <Icon icon="solar:gallery-wide-bold" width="48" height="48" />
            </button>
          </Link>

          <button
            onClick={onTakePhoto}
            disabled={!isCameraOn}
            className="flex flex-col items-center transition-transform duration-200 hover:scale-110">
            <Icon
              icon="fluent:record-12-regular"
              width="64"
              height="64"
              className="cursor-pointer transition-transform duration-150 active:scale-95 hover:scale-105"
            />
          </button>

          <button
            className={`flex flex-col items-center transition-transform duration-200 hover:scale-110 ${
              hasMultipleCameras
                ? "animate-spin-slow cursor-pointer"
                : "text-gray-400 cursor-not-allowed"
            }`}
            disabled={!hasMultipleCameras}
            onClick={hasMultipleCameras ? onSwitchCamera : undefined}
            aria-label="Switch Camera">
            <Icon icon="ic:round-loop" width="48" height="48" />
          </button>
        </>
      )}
    </div>
  )
}
export default CameraConsole
