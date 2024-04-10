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

export const getAllMentors = async () =>{
    const mentors = await Mentor.find();
}