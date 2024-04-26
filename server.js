import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import session from 'express-session'
import passport from 'passport'
import { connectDB } from './config/database.js'
import MongoStore from 'connect-mongo'
import authRouter from './routes/auth.js'
import adminRouter from './routes/admin.js'
import mentorRouter from './routes/mentor.js'
import { Server } from "socket.io"
import menteeRouter from "./routes/user.js"
import conversation from './routes/conversation.js'
import http from 'http'
import User from './models/User.js'
import Mentor from './models/Mentor.js'
import Conversation from './models/Conversation.js'

const app = express()
dotenv.config()

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set(("trust proxy", 1));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
    },
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        ttl: 24 * 60 * 60 * 1000
    })
}))

app.use(passport.initialize())
app.use(passport.session())
app.use('/api/auth', authRouter)
app.use('/api/admin', adminRouter)
app.use('/api/mentor', mentorRouter)
app.use('/api/mentee', menteeRouter)

app.use('/api/admin', adminRouter)
app.use('/api/mentor', mentorRouter)
app.use('/api/conversation', conversation)

app.get('/', (req, res) => {
    res.send('Hello World')
})

let onlineUsers = {}
const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
    console.log('a user connected'); 
    
    socket.on('online', async ({userId}) => {
        onlineUsers[userId] = socket
    });
    socket.on('get_conversations', async ({ userId, role }) => {
        if (role === "mentee") {
            const user = await User.findById(userId).populate('mentors')
            const conversation = await Conversation.find({ participants: { $in: [userId] } })
            const mentors = user.mentors.map(mentor => {
                const conv = conversation.find(con => con.participants.includes(mentor._id))
                if (conv) {
                    return {
                        user: mentor,
                        chat: conv.messages,
                        lastMessage: conv.messages[conv.messages.length - 1].text,
                        lastTime: conv.messages[conv.messages.length - 1].createdAt,
                        
                    }
                }
                else {
                    return {
                        user: mentor,
                        chat: [],
                        // online: onlineUsers.find(user => user.userId === mentor._id)
                    }
                }
            })
            socket.emit('conversations', mentors)
        }
        else {
            const mentor = await Mentor.findById(userId).populate('mentees')
            const conversation = await Conversation.find({ participants: { $in: [userId] } })
            const mentees = mentor.mentees.map(mentee => {
                const conv = conversation.find(con => con.participants.includes(mentee._id))
                if (conv) {
                    return {
                        user: mentee,
                        chat: conv.messages,
                        lastMessage: conv.messages[conv.messages.length - 1].text,
                        lastTime: conv.messages[conv.messages.length - 1].createdAt,
                        // online: onlineUsers.find(user => user.userId === mentee._id)
                    }
                }
                else {
                    return {
                        user: mentee,
                        chat: [],
                        // online: onlineUsers.find(user => user.userId === mentee._id)
                    }
                }
            })
            socket.emit('conversations', mentees)
        }
    });
    socket.on('send_message', async (msg) => {
        const { from, to } = msg
        const conversation = await Conversation.findOne({ participants: { $all: [from, to] } })
        if (conversation) {
            conversation.messages.push(msg)
            await conversation.save()
            console.log(conversation)
        }
        else {
            const newConversation = new Conversation({
                participants: [from, to],
                messages: [msg]
            })
            await newConversation.save()
        }
        onlineUsers[to]?.emit('send_message', msg)
        onlineUsers[from]?.emit('send_message', msg)
    })
});

const startServer = async () => {
    try {
        await connectDB()
        server.listen(5000, () => {
            console.log(`Server running on port 5000`)
        })
    } catch (err) {
        console.error(err)
    }
}

startServer()

mongoose.connection.on('connected', () => {
    console.log('MongoDB connected')
})

mongoose.connection.on('disconnected', (err) => {
    console.error('MongoDB disconnected')
})