import express from "express"
import { applyMentor, getMentor, getMentors } from "../controllers/mentor.js";
import { verifyMentor } from "../config/verifyUser.js";
const router = express.Router()

router.post("/apply",verifyMentor,applyMentor);
router.get("/mentors",verifyMentor,getMentors);
router.get('/',verifyMentor,getMentor);

export default router;