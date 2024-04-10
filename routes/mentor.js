import express from "express"
import { applyMentor } from "../controllers/mentor.js";
const router = express.Router()

router.post("/apply",applyMentor);

export default router;