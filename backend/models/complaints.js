import mongoose, {Schema} from "mongoose"

const complaintSchema = new Schema({
    area: {
        type: String,
        required: true
    },

    complaint: {
        type: String,
        required: true
    },
    note: {
        type: String
    }


}, { timestamps: true })

export const Complaint = mongoose.model("Complaint", complaintSchema)