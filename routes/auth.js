import express from "express";
import { forgotPassword, logout, signIn, signUp, verifyEmail, verifyOtp } from "../controllers/auth.js";

const router = express.Router();

router.post("/register", signUp, verifyEmail);
router.post("/login", signIn);
router.post("/verify-email", verifyEmail);
router.post("/verify-otp", verifyOtp);
router.patch("/forgot-password", forgotPassword);
router.get("/logout",logout)


export default router;

 