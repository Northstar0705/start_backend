import express from 'express';
import { newConversation,getConversation } from "../controllers/Conversation.js";

const router = express.Router()

// new conversation
router.post('/new', newConversation)
// get conversation of a user
router.get('/:userId',getConversation)
export default router