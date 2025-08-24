import mongoose, {Schema} from "mongoose"

const contactSchema = new Schema({
    area: {
        type: String,
        required: true
    },
    query: {
        type: String,
        required: true
    },
    contacts: {
        type: String,
        enum: ["Phone", "Email"],
        required: true
    }
}, { timestamps: true })

export const Contact = mongoose.model("Contact", contactSchema)