import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"

import authRoutes from "./routes/auth.route.js"

dotenv.config()

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Database is connected")
  })
  .catch((err) => {
    console.log(err)
  })

const app = express()

// for allowing json object in req body
app.use(express.json())

app.listen(3000, () => {
  console.log("Server is running on port 3000!")
})

app.use("/api/auth", authRoutes)
