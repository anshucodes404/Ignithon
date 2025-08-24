import mongoose, {Schema} from "mongoose"

const supplierSchema = new Schema({
    area: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    contact: {
        type: Number,
    }
}, { timestamps: true })

export const Supplier = mongoose.model("Supplier", supplierSchema)