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
import menteeRouter from "./routes/user.js"

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
        httpOnly: true
    },
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        ttl: 24 * 60 * 60 * 1000
    })
}))

app.use(passport.initialize())
app.use(passport.session())
app.use('/api/auth', authRouter)
app.use('/api/admin',adminRouter)
app.use('/api/mentor',mentorRouter)
app.use('/api/mentee',menteeRouter)
app.get('/', (req, res) => {
    res.send('Hello World')
})

const startServer = async () => {
    try {
        await connectDB()
        app.listen(5000, () => {
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