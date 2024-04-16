
import express from 'express';
import { getMessage, newMessage } from '../controllers/message.js';


const router = express.Router()

// add message
router.post('/new', newMessage)

// get message
router.get('/:conversationId', getMessage)

export default router