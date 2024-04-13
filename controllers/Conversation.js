
import User from '../models/User';
import Conversation from '../models/Conversation';
export const newConversation = async (req, res) => {
    try {
        const conversation = new Conversation({
            members: [req.body.senderId, req.body.receiverId],

        })
        const savedConversation = await conversation.save()
        res.status(200).json(savedConversation)
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: "Internal Server Error" })
    }
}
export const getConversation = async (req, res) => {
    try {
        const conversation = await Conversation.find({
            members: { $in: [req.params.userId] }
        })

    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: "Internal Server Error" })
    }
}


