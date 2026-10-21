import express from "express";
import { getUserCourseProgress, getUserData, getUserEnrolledCourses, purchaseCourse, updateUserCourseProgress, userRating, verifyPurchase } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/data", getUserData);
userRouter.get("/enrolled", getUserEnrolledCourses);
userRouter.post('/purchase', purchaseCourse);
userRouter.post('/verify-purchase', verifyPurchase);
userRouter.post("/update-progress", updateUserCourseProgress)
userRouter.post("/get-progress", getUserCourseProgress)
userRouter.post("/add-rating", userRating)

export default userRouter;
