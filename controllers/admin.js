import Mentor from "../models/Mentor.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs"

export const adminLogin = async (req, res, next) => {
    const { email, password } = req.body;
    try {

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }
        if (user.role !== "admin") {
            return res.status(400).json({ message: "You don't have permission to access admin panel" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Incorrect email or password" });
        }
        req.session.user = {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        }
        res.status(200).json({ message: "Logged in successfully" });
    }catch(err){
        console.log(err);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const getUsers = async (req, res, next) => {
    try{

        const admin = await User.find({role:"admin"});
        const mentee = await User.find({role:"mentee"});
        const mentors = await Mentor.find({ verified: true })
        res.status(200).json({ mentee, mentors, admin });
    }catch(err){
        console.log(err);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const getApplications = async (req, res, next) => {
    try{
        const applications = await Mentor.find({ verified: false });
        res.status(200).json(applications);
    }catch(err){
        console.log(err);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const getApplication = async (req, res, next) => {
    try{
        const { id } = req.params;
        const mentor = await Mentor.findById(id);
        res.status(200).json(mentor);
    }catch(err){
        console.log(err);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const addAdmin = async (req, res, next) => {
    try{
        const { id } = req.params;
        const user = await User.findById(id);
        user.role = "admin";
        await user.save();
        res.status(200).json({ message: "Admin added successfully" });
    }
    catch(err){
        console.log(err);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const acceptApplication = async (req, res, next) => {
    try{
        const { mentorId } = req.params;
        const mentor = await Mentor.findById(mentorId);
        mentor.verified = true;
        await mentor.save();
        res.status(200).json({ message: "Application accepted successfully" });
    }catch(err){
        console.log(err);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const rejectApplication = async (req, res, next) => {
    try{
        const { mentorId } = req.params;
        await Mentor.findByIdAndDelete(mentorId);
        res.status(200).json({ message: "Application rejected successfully" });
    }catch(err){
        console.log(err);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const deleteMentee = async (req, res, next) => {
    try{
        const { menteeId } = req.params;
        await User.findByIdAndDelete(menteeId);
        res.status(200).json({ message: "Mentee deleted successfully" });
    }catch(err){
        console.log(err);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const deleteMentor = async (req, res, next) => {
    try{
        const { mentorId } = req.params;
        await Mentor.findByIdAndDelete(mentorId);
        res.status(200).json({ message: "Mentor deleted successfully" });
    }catch(err){
        console.log(err);
        res.status(500).json({message: "Internal Server Error"});
    }
}