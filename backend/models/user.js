import mongoose, { Schema } from "mongoose"

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        area: {
            type: String,
        },
        food_preference: {
            enum: ["Veg", "Non-Veg"],
            type: String,
            default: "Veg"

        }
    },
    { timestamps: true })

export const User = mongoose.model("User", userSchema)