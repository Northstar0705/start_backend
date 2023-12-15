import User from "../models/User.js"
import bcrypt from "bcryptjs"
import passport from "passport"
import session from "express-session"

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
        res.status(500).json({ message: "Something went wrong" })
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
            return res.status(400).json({ message: "Invalid Credentials" });
        }


        req.session.user = {
            id: user._id,
            username: user.username,
            email: user.email,

        };

        res.status(200).json({ message: "Logged in successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }

}