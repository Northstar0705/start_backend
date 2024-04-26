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
    image:{
        type: String
    },
    goal:{
        type:String
    },
    linkedIn:{
        type:String
    },
    twitter:{
        type:String
    },
    location:{
        type:String
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
    },
    interests:[{
        type: String
    }],
    mentors:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Mentor"
    }],
},{timestamps: true})

export default mongoose.model("User", userSchema);