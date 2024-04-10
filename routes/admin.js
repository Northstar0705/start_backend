import express from "express";
import { acceptApplication, addAdmin, adminLogin, deleteMentee, deleteMentor, getApplication, getApplications, getUsers, rejectApplication } from "../controllers/admin.js";
const router = express.Router();

router.post("/login",adminLogin);
router.get("/users",getUsers);
router.get("/applications",getApplications);
router.get("/applications/:id",getApplication);
router.patch('/applications/:mentorId',acceptApplication);
router.delete('/applications/:mentorId',rejectApplication);
router.delete('/mentee/:menteeId',deleteMentee);
router.delete('/mentor/:mentorId',deleteMentor);
router.patch("/addAdmin/:id",addAdmin);
export default router;