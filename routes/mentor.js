import express from "express"
import { applyMentor, changePassword, getMentor, getMentors, updateMentor } from "../controllers/mentor.js";
import { verifyMentor } from "../config/verifyUser.js";
const router = express.Router()

router.post("/apply",applyMentor);
router.get("/mentors",getMentors);
router.get('/',verifyMentor,getMentor);
router.patch('/changePassword',verifyMentor,changePassword)
router.patch('/update',verifyMentor,updateMentor)

export default router;