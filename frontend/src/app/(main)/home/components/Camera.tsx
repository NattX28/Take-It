"use client"
import { useRef, useState, useEffect } from "react"
import { Icon } from "@iconify/react"
import CameraConsole from "./CameraConsole"

const Camera = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isCameraOn, setIsCameraOn] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user")
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false)
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null)
  const [caption, setCaption] = useState<string>("")
  const [isAddingCaption, setIsAddingCaption] = useState(false)

  // Check if the device has multiple cameras
  const checkForMultipleCameras = async () => {
    try {
      // want to permission to access the camera for enumrateDevices can work correctly
      await navigator.mediaDevices.getUserMedia({ video: true })

      // get all devices data
      const devices = await navigator.mediaDevices.enumerateDevices()

      // filter the devices to get only video input devices
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      )

      // if has more than one camera
      setHasMultipleCameras(videoDevices.length > 1)
    } catch (error) {
      setError("Failed to access camera" + error)
      setHasMultipleCameras(false)
    }
  }

  // stop camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      const tracks = stream.getTracks()
      tracks.forEach((track) => {
        track.stop()
      })
      videoRef.current.srcObject = null // clear the video element
      setIsCameraOn(false) //
    }
  }

  // Start the camera
  const startCamera = async () => {
    try {
      if (videoRef.current && videoRef.current.srcObject) {
        // stop camera if already started
        stopCamera()
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
        },
        audio: false,
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsCameraOn(true)
        setError(null)

        // check permission after get it (some borwsers need to ask for permission first)
        await checkForMultipleCameras()
      }
    } catch (error) {
      const err = error as Error
      setError("Failed to access camera" + err.message)
      console.error("Error accessing camera:", err)
    }
  }

  // Switch camera
  const switchCamera = () => {
    // toggle between user and environment camera (facingMode)
    const newFacingMode = facingMode === "user" ? "environment" : "user"
    setFacingMode(newFacingMode)

    if (isCameraOn) {
      stopCamera()

      setTimeout(() => {
        startCamera()
      }, 300)
    }
  }

  // Take photo
  const takePhoto = () => {
    if (!isCameraOn) return

    const video = videoRef.current
    const canvas = canvasRef.current

    if (video && canvas) {
      const context = canvas.getContext("2d")

      // determine the size of the canvas to match the video
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      // draw the video frame to the canvas
      context?.drawImage(video, 0, 0, canvas.width, canvas.height)

      // convert the canvas to a base64 image
      const photoData = canvas.toDataURL("image/jpeg")

      //  save the captured photo
      setCapturedPhoto(photoData)

      // stop camera after taking the photo
      stopCamera()
    }
  }

  const handleCancel = () => {
    setCapturedPhoto(null)
    setCaption("")
    setIsAddingCaption(false)
    startCamera()
  }

  const handleUpload = () => {
    // Implement the upload logic here

    console.log("Uploading photo with caption:", caption)
    alert("Photo uploaded successfully!")

    // Reset the state after upload
    setCapturedPhoto(null)
    setCaption("")
    setIsAddingCaption(false)
    startCamera()
  }

  const toggleCaptionInput = () => {
    setIsAddingCaption(!isAddingCaption)
  }

  useEffect(() => {
    startCamera()

    // cleanup function to stop the camera when the component unmounts
    return () => {
      stopCamera()
    }
  }, [])

  return (
    <div className="flex flex-col items-center gap-8">
      {error && <div className="text-red-500">{error}</div>}

      <div className="w-full aspect-square relative rounded-4xl overflow-hidden">
        {capturedPhoto ? (
          <img
            src={capturedPhoto}
            alt="Captured photo"
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
      </div>

      {/* canvas for taking photo (hidden) */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Caption input if adding caption */}
      {capturedPhoto && isAddingCaption && (
        <div className="w-full p-2">
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Tell something"
            className="w-full p-2 border-rounded-lg"
            autoFocus
          />
        </div>
      )}

      {/* Camera Console */}
      <CameraConsole
        isCaptureMode={!!capturedPhoto}
        hasMultipleCameras={hasMultipleCameras}
        isCameraOn={isCameraOn}
        onTakePhoto={takePhoto}
        onCancle={handleCancel}
        onUpload={handleUpload}
        onToggleCaption={toggleCaptionInput}
        onSwitchCamera={switchCamera}
        onStartCamera={startCamera}
      />
    </div>
  )
}
export default Camera
