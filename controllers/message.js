
import Message from "../models/Message.js";

export const newMessage = async (req, res) => {
    const newMessage = new Message(req.body)
    try {
        const savedMessage = await newMessage.save()
        res.status(200).json(savedMessage)
    }
    catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}

export const getMessage = async (req, res) => {
    try {
        const messages = await Message.find({
            ConversationId: red.params.conversationId


        })
        res.status(200).json(messages)
    }
    catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}