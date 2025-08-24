import cors from "cors"
import express from "express"
import foodWasteRoutes from "./routes/foodWaste.js"

const app = express()

app.use(cors())
app.use(express.json())

// Food waste routes for map
app.use("/api/food-waste", foodWasteRoutes)

export default app