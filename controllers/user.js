import Mentor from "../models/Mentor.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs"

export const getReccomendation = async (req, res, next) => {
    const { _id: id } = req.session.user
    try {
        const mentee = await User.findById(id);
        const interest = mentee.interests;
        const mentors = await Mentor.find()
        const mentorRecommendations = mentors.map((mentor) => {
            const mentorSkills = mentor.skills;
            const mentorVector = mentorSkills.reduce((acc, skill) => {
                if (interest.includes(skill)) {
                    acc.push(1)
                } else {
                    acc.push(0)
                }
                return acc
            }, [])
            let similarity = 0;
            for (let i = 0; i < mentorVector.length; i++) {
                similarity += mentorVector[i] * mentorVector[i]
            }
            similarity = Math.sqrt(similarity)
            return {
                mentor,
                similarity
            }
        })
        mentorRecommendations.sort((a, b) => b.similarity - a.similarity)
        const reccomendation = mentorRecommendations.filter(mentor => mentor.similarity > 0)
        res.status(200).json(reccomendation)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Internal server error" })
    }
}

export const getMentees = async (req, res, next) => {
    try {
        const mentees = await User.find({ role: "mentee" })
        res.status(200).json(mentees)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Internal server error" })
    }
}

export const getMentee = async(req,res,next) =>{
    if(!req.session.user){
        return res.status(401).json({errorMessage: "Please login first"})
    }
    return res.status(200).json(req.session.user)
}

export const changePassword = async(req,res,next) =>{
    const {oldPassword,newPassword} = req.body
    try{
        const user = await User.findById(req.session.user._id)
        console.log(user)
        const isPasswordValid = await bcrypt.compare(oldPassword,user.password)
        if(!isPasswordValid){
            return res.status(400).json({errorMessage:"Invalid password"})
        }
        const hashedPassword = await bcrypt.hash(newPassword,12)
        user.password = hashedPassword
        await user.save()
        return res.status(200).json({message:"Password changed successfully"})
    }
    catch(err){
        console.log(err)
        return res.status(500).json({errorMessage:"Internal server error"})
    }
}

export const updateMentee = async(req, res, next) =>{
    const keys = Object.keys(req.body)
    try{
        const user = await User.findById(req.session.user._id)
        keys.forEach(key => {
            user[key] = req.body[key]
        })  
        await user.save()
        req.session.user = user
        await req.session.save()
        return res.status(200).json({message:"Updated successfully"})
    }catch(err){
        return res.status(500).json({errorMessage:"Internal server error"})
    }
}

export const addMentor = async(req,res,next) =>{
    const {mentorId} = req.body;
    try{
        const user = await User.findById(req.session.user._id)
        const mentor = await Mentor.findById(mentorId)
        mentor.mentees.push(user._id)
        await mentor.save()
        user.mentors.push(mentorId)
        await user.save()
        req.session.user = user
        await req.session.save()
        return res.status(200).json({message:"Mentor added successfully"})
    }catch(err){
        return res.status(500).json({errorMessage:"Internal server error"})
    }
}