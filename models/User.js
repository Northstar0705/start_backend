import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password: {
        type:String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    },
    verified: {
        type: Boolean,
        default: false
    },
    role:{
        type: String,
        default: "mentee"
    }
},{timestamps: true})

export default mongoose.model("User", userSchema);