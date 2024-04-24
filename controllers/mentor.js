import bcrypt from 'bcryptjs'
import Mentor from '../models/Mentor.js'

export const applyMentor = async (req,res,next)=>{
    const {password,...others} = req.body
    try{
        const hashedPassword = await bcrypt.hash(password,12)   
        const newMentor = new Mentor({...others,password:hashedPassword})
        newMentor.save();
        return res.status(201).json({status:"success",msg:"Applied sucessfully..."})
    }catch(err){
        console.log(err)
        return res.status(500).json({status:"error",msg:"Internal Server Error"})
    }
}

export const getMentors = async (req,res,next) =>{
    try{
        // demo link
        // http://localhost:5000/api/mentors?skills=java,react.js
        let {skills} = req.query
        if(skills.length>0){
            skills = skills.split(',')
            // return even if one word of the skill matches
            const mentors = await Mentor.find({skills:{$in:skills.map(skill=>new RegExp(skill,'i'))}})
            return res.status(200).json(mentors)
        }
        const mentors = await Mentor.find()
        return res.status(200).json(mentors)
    }catch(err){
        console.log(err)
        return res.status(500).json({status:"error",msg:"Internal Server Error"})
    }
}

export const getMentor = async (req,res,next) =>{
    if(!req.session.mentor){
        return res.status(401).json({status:"error",msg:"Please login first"})
    }
    return res.status(200).json(req.session.mentor)
}

export const changePassword = async(req,res,next) =>{
    const {oldPassword,newPassword} = req.body
    try{
        const user = await Mentor.findById(req.session.mentor._id)
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

export const updateMentor = async(req, res, next) =>{
    const keys = Object.keys(req.body)
    try{
        const user = await Mentor.findById(req.session.mentor._id)
        keys.forEach(key => {
            user[key] = req.body[key]
        })  
        await user.save()
        req.session.mentor = user
        await req.session.save()
        return res.status(200).json({message:"Updated successfully"})
    }catch(err){
        console.log(err)
        return res.status(500).json({errorMessage:"Internal server error"})
    }
}