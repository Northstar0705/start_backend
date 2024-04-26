import mongoose from 'mongoose'

const ConversationScema = mongoose.Schema({
    participants: [{
        type: String
    }],
    messages: [{
        from: String,
        to: String,
        text: String,
        createdAt: Date
    }]
}, { Timestamp: true })
export default mongoose.model('Conversation', ConversationScema)