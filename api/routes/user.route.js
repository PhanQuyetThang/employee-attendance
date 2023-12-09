import express from "express";
import { deleteUser, test, updateUser, getUser, amountUser, ProfileDetail, AttendanceDetail, saveBiometricData, saveBiometric, testApi, checkFingerprint, Search, getBiometric, updateBiometric, deleteBiometric } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get('/test', test);
router.get('/test-api', testApi);
router.post('/update/:id', verifyToken, updateUser)
router.delete('/delete/:id', verifyToken, deleteUser)
router.get('/get-user', verifyToken, getUser)
router.get('/amount-user', verifyToken, amountUser)
router.get('/profile-detail/:id', verifyToken, ProfileDetail)
router.get('/attendance-detail/:id', verifyToken, AttendanceDetail)

router.post('/save-biometric-data', verifyToken, saveBiometricData);
router.get('/save-biometric/:id', saveBiometric)
router.get('/update-biometric/:id', verifyToken, updateBiometric)
router.get('/delete-biometric/:id', verifyToken, deleteBiometric)
router.get('/get-biometric/:id', verifyToken, getBiometric)
router.post('/check-fingerprint', checkFingerprint);
router.post('/search/:id', Search)


export default router;