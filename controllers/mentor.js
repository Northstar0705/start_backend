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
