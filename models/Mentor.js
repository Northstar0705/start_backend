import mongoose, { Schema } from "mongoose";

const mentorSchema = new Schema({
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
    password:{
        type:String,
        required: true
    },
    jobTitle:{
        type:String,
        required: true
    },
    company:{
        type:String,
        required: true
    },
    category:{
        type:String,
        required: true
    },
    skills:[{
        type:String,
        required: true
    }],
    bio:{
        type:String,
        required: true
    },
    profilePicture:{
        type:String,
        required: true
    },
    linkedin:{
        type:String,
        required: true
    },
    twitter:{
        type : String
    },
    website:{
        type : String
    },
    introVideo:{
        type : String
    },
    article:{
        type : String
    },
    whyMentor:{
        type : String
    },
    greatestAchievement:{
        type : String
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    verified: {
        type: Boolean,
        default: false
    },
    mentees:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
},{timestamps:true});

export default mongoose.model("Mentor", mentorSchema);