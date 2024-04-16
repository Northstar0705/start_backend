import express from "express";
import { acceptApplication, addAdmin, adminLogin, getAdmin, deleteMentee, deleteMentor, getApplication, getApplications, getUsers, rejectApplication } from "../controllers/admin.js";
import { verifyAdmin } from "../config/verifyUser.js";
const router = express.Router();

router.post("/login",verifyAdmin, adminLogin);
router.get("/users",verifyAdmin, getUsers);
router.get("/applications",verifyAdmin, getApplications);
router.get("/applications/:id",verifyAdmin, getApplication);
router.get('/',verifyAdmin, getAdmin);
router.patch('/applications/:mentorId',verifyAdmin, acceptApplication);
router.delete('/applications/:mentorId',verifyAdmin, rejectApplication);
router.delete('/mentee/:menteeId',verifyAdmin, deleteMentee);
router.delete('/mentor/:mentorId',verifyAdmin, deleteMentor);
router.patch("/addAdmin/:id",verifyAdmin, addAdmin);
export default router;