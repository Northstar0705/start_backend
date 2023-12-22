import express from "express";
import { mentorApply, signIn, signUp } from "../controllers/auth.js";

const router = express.Router();

router.post("/register", signUp);
router.post("/login", signIn);
router.post("/apply", mentorApply)


export default router;

 