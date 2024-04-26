import User from "../models/User.js"
import bcrypt from "bcryptjs"
import otpGenerator from "otp-generator"
import UserOtp from "../models/UserOtp.js"
import emailjs from '@emailjs/nodejs';
import dotenv from 'dotenv'
import Mentor from "../models/Mentor.js";

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
        req.session.user = user
        await req.session.save()
        next()
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}
export const signIn = async (req, res, next) => {
    const { email, password, isMentee, isAdmin } = req.body;
    try {
        let user;
        if (!isMentee)
            user = await Mentor.findOne({ email });
        else
            user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }
        if (isAdmin && user.role !== "admin") {
            return res.status(400).json({ message: "You don't have admin access" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or passowrd" });
        }
        if (isAdmin)
            req.session.admin = user
        else if (!isMentee)
            req.session.mentor = user
        else
            req.session.user = user
        await req.session.save()
        res.status(200).json({ message: "Logged in successfully", user: user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const verifyEmail = async (req, res, next) => {
    const { email } = req.body || req.session.user
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
            expireAt: Date.now() + 5 * 60000
        })
        await userOtp.save()
        await emailjs.send(process.env.EMAIL_SERVICE, req.session.user ? process.env.EMAIL_TEMPLATE2 : process.env.EMAIL_TEMPLATE, {
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
    let { email, otp } = req.body
    email = email ? email : req.session.user.email
    try {
        const userOtp = await UserOtp.findOne({ email: email })
        if (Date.now() > userOtp.expireAt) {
            return res.status(419).json('Timeout')
        }
        else if (otp === userOtp.OTP) {
            const user = await User.findById(req.session.user._id)
            user.verified = true
            req.session.user = user
            await user.save()
            await req.session.save()
            return res.status(200).json({ message: 'verified', userId: userOtp.userId })
        }
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

export const logout = async (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ errorMessage: "Internal server error" })
        }
        res.clearCookie(process.env.SESS_NAME)
        res.status(200).json({ message: "Logged out successfully" })
    })
}