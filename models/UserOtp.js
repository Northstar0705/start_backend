import mongoose from "mongoose";
import { Schema } from "mongoose";

const UserOtp = new Schema(({
    email : {
        type: String
    },
    OTP : {
        type : String
    },
    createdAt : {
        type :Date
    },
    expireAt : {
        type: Date
    }
}))

export default mongoose.model('UserOtp',UserOtp)