
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
export default mongoose.model('Conversation', ConversationScema)