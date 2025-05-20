import multer from "multer"
import path from "path"
import fs from "fs"

// Create uploads directory if it doesn't exit
const uploadsDir = path.join(process.cwd(), "uploads")
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname)
    const filename = `${uniqueSuffix}${ext}`
    cb(null, filename)
  },
})

// Configure file filter to allow only images
const fileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  // Accept only image files
  if (file.mimetype.startsWith("image/")) {
    cb(null, true)
  } else {
    cb(new Error("Only image files are allowed"))
  }
}

// export configuration constants
export const uploadConfig = {
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB file size limit
  },
}

// Export uploads directory path for potential use elsewhere
export const uploadsDirectory = uploadsDir

// Cleanup func for temp files
export const cleanupUploads = () => {
  const hoursConfig: number = 24 * 60 * 60 * 1000 // 24 hrs
  fs.readdir(uploadsDir, (err, files) => {
    if (err) return
    const now = Date.now()
    files.forEach((file) => {
      const filePath = path.join(uploadsDir, file)
      fs.stat(filePath, (err, stats) => {
        if (err) return
        // Deleate files older than 24 hours
        if (now - stats.mtimeMs > hoursConfig) {
          fs.unlink(filePath, () => {})
        }
      })
    })
  })
}

// Run cleanup at module import time
cleanupUploads()

const scheduleTimeClean: number = 60 * 60 * 1000 // 1 hr
// Schedule regular cleanup every hour
setInterval(cleanupUploads, scheduleTimeClean)
