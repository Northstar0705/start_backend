import User from "../models/User.js"
import bcrypt from "bcryptjs"
import otpGenerator from "otp-generator"
import UserOtp from "../models/UserOtp.js"
import emailjs from '@emailjs/nodejs';
import dotenv from 'dotenv'

dotenv.config()

export const signUp = async (req, res, next) => {
    const { firstName, lastName, email, password } = req.body
    try {
        const existingEmail = await User.findOne({ email })
        if (existingEmail) {
            return res.status(400).json({ message: "Email already exists" })
        }
        const hashedPassword = await bcrypt.hash(password, 12)

        const user = new User({ firstName, lastName, email, password: hashedPassword })

        await user.save()
        res.status(201).json({ message: "User created successfully" })
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}
export const signIn = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or passowrd" });
        }
        req.session.user = {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        };
        res.status(200).json({ message: "Logged in successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const verifyEmail = async (req,res,next) => {
    const { email } = req.body
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "Email not found" })
        }
        await UserOtp.findOneAndDelete({ email: email })
        const otp = otpGenerator.generate(6, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false })
        console.log(otp)
        const userOtp = new UserOtp({
            email: email,
            OTP: otp,
            createdAt: Date.now(),
            expireAt: Date.now() + 5 * 600000
        })
        await userOtp.save()
        await emailjs.send(process.env.EMAIL_SERVICE, process.env.EMAIL_TEMPLATE, {
            to_email: email,
            otp: otp,
            to_name: user.firstName
        }, { publicKey: process.env.EMAIL_PUBLIC_KEY, privateKey: process.env.EMAIL_PRIVATE_KEY })
        res.status(200).json({ message: "OTP sent successfully" })
    } catch (err) {
        res.status(500).json(err)
    }
}

export const verifyOtp = async (req, res) => {
    const { email, otp } = req.body
    try {
        const userOtp = await UserOtp.findOne({ email: email })
        if (Date.now() > userOtp.expireAt) {
            userOtp.remove()
            return res.status(419).json('Timeout')
        }
        if (otp === userOtp.OTP) return res.status(200).json({ message: 'verified', userId: userOtp.userId })
        else return res.status(400).json('Invalid OTP')
    } catch (err) {
        res.status(500).json(err)
    }
}

export const forgotPassword = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email: email })
        user.password = await bcrypt.hash(password, 12)
        await user.save()
        res.status(200).json({ message: 'Password changed successfully' })
    } catch (err) {
        res.status(500).json(err)
    }
}
