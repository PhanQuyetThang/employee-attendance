import express from "express";
import { deleteUser, test, updateUser, getUser, amountUser, ProfileDetail } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
import { test2 } from "../../api/controllers/user.controller.js";

const router = express.Router();

router.get('/test', test);
router.post('/update/:id', verifyToken, updateUser)
router.delete('/delete/:id', verifyToken, deleteUser)
router.get('/get-user', verifyToken, getUser)
router.get('/amount-user', verifyToken, amountUser)
router.get('/profile-detail/:id', verifyToken, ProfileDetail)
router.get('/test-esp-request', test2)


export default router;