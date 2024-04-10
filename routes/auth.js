import express from "express";
import { forgotPassword, signIn, signUp, verifyEmail, verifyOtp } from "../controllers/auth.js";

const router = express.Router();

router.post("/register", signUp);
router.post("/login", signIn);
router.post("/verify-email", verifyEmail);
router.post("/verify-otp", verifyOtp);
router.patch("/forgot-password", forgotPassword);


export default router;

 