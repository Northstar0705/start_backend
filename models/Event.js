import mongoose, { Schema } from "mongoose"

const eventSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    start: {
        type: Date,
        required: true
    },
    end: {
        type: Date,
        required: true
    },
    host: {
        type: Schema.Types.ObjectId,
        ref: 'Mentor'
    },
    participants: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true })

export default mongoose.model("Event",eventSchema)
