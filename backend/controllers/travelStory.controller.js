import { fileURLToPath } from "url"
import TravelStory from "../models/travelStory.model.js"
import { errorHandler } from "../utils/error.js"
import path from "path"
import fs from "fs"

export const addTravelStory = async (req, res, next) => {
  const { title, story, visitedLocation, imageUrl, visitedDate } = req.body

  const userId = req.user.id

  //   validate required field
  if (!title || !story || !visitedLocation || !imageUrl || !visitedDate) {
    return next(errorHandler(400, "All fields are required"))
  }

  //   convert visited date from milliseconds to Date Object
  const parsedVisitedDate = new Date(parseInt(visitedDate))

  try {
    const travelStory = new TravelStory({
      title,
      story,
      visitedLocation,
      userId,
      imageUrl,
      visitedDate: parsedVisitedDate,
    })

    await travelStory.save()

    res.status(201).json({
      story: travelStory,
      message: "You story is added successfully!",
    })
  } catch (error) {
    next(error)
  }
}

export const getAllTravelStory = async (req, res, next) => {
  const userId = req.user.id

  try {
    const travelStories = await TravelStory.find({ userId: userId }).sort({
      isFavorite: -1,
    })

    res.status(200).json({ stories: travelStories })
  } catch (error) {
    next(error)
  }
}

export const imageUpload = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(errorHandler(400, "No image uploaded"))
    }

    const imageUrl = `http://localhost:3000/uploads/${req.file.filename}`

    res.status(201).json({ imageUrl })
  } catch (error) {
    next(error)
  }
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const rootDir = path.join(__dirname, "..")

export const deleteImage = async (req, res, next) => {
  const { imageUrl } = req.query

  if (!imageUrl) {
    return next(errorHandler(400, "imageUrl parameter is required!"))
  }

  try {
    // extract the file name from the imageUrl
    const filename = path.basename(imageUrl)

    // Delete the file path
    const filePath = path.join(rootDir, "uploads", filename)

    console.log(filePath)

    // check if the file exists
    if (!fs.existsSync(filePath)) {
      return next(errorHandler(404, "Image not found!"))
    }

    // delete the file
    await fs.promises.unlink(filePath)

    res.status(200).json({ message: "Image deleted successfully!" })
  } catch (error) {
    next(error)
  }
}
