import express from "express"
import { verifyToken } from "../utils/verifyUser.js"
import { addTravelStory } from "../controllers/travelStory.controller.js"

const router = express.Router()

router.post("/add", verifyToken, addTravelStory)

export default router
