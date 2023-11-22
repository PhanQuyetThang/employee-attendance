import express from "express";
import { deleteUser, test, updateUser, getUser, amountUser, ProfileDetail, AttendanceDetail, saveBiometricData, saveBiometric } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get('/test', test);
router.post('/update/:id', verifyToken, updateUser)
router.delete('/delete/:id', verifyToken, deleteUser)
router.get('/get-user', verifyToken, getUser)
router.get('/amount-user', verifyToken, amountUser)
router.get('/profile-detail/:id', verifyToken, ProfileDetail)
router.get('/attendance-detail/:id', verifyToken, AttendanceDetail)
router.post('/save-biometric-data', verifyToken, saveBiometricData);
router.post('/save-biometric', verifyToken, saveBiometric)


export default router;