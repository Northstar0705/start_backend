import express from "express"
import { getMentee, getMentees, getReccomendation, changePassword, updateMentee, addMentor } from "../controllers/user.js"
import { verifyMentee } from "../config/verifyUser.js"
const router = express.Router()

router.get("/reccomendations",verifyMentee, getReccomendation)
router.get("/mentees",verifyMentee, getMentees)
router.get('/',verifyMentee, getMentee)
router.patch("/changePassword", verifyMentee, changePassword)
router.patch('/update',verifyMentee,updateMentee)
router.patch('/addMentor',verifyMentee,addMentor)

export default router;