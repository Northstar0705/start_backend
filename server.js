import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import session from 'express-session'
import passport from 'passport'
import { connectDB } from './config/database.js'
import MongoStore from 'connect-mongo'
import authRouter from './routes/auth.js'

const app = express()
dotenv.config()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        sameSite: 'none',
        secure: false,
        maxAge: 1000 * 60 * 60 * 24
    },
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        ttl: 24 * 60 * 60 * 1000
    })
}))

app.use(passport.initialize())
app.use(passport.session())
app.use('/api/auth', authRouter)
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