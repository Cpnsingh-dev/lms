import express from "express";
import { getUserData, getUserEnrolledCourses, purchaseCourse, verifyPurchase } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/data", getUserData);
userRouter.get("/enrolled", getUserEnrolledCourses);
userRouter.post('/purchase', purchaseCourse);
userRouter.post('/verify-purchase', verifyPurchase);

export default userRouter;
