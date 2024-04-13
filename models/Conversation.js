
import mongoose from 'mongoose'
const ConversationScema = mongoose.Schema(
    {
        members: {
            type: Array
        }

    }
    ,
    {
        timestamps: true
    }
)
module.exports = mongoose.model('Conversation', ConversationScema)   