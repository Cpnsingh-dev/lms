
import express from "express";

import { addCourse, getEducatorData, getEducatorCourses, updateRoleToEducator, getEnrolledStudents } from "../controllers/educatorController.js";
import upload from "../configs/multer.js";
import { protectEducator } from "../middlewares/authMidddleWare.js";


const educatorRouter = express.Router();

//Add educator role api
educatorRouter.get("/update-role", updateRoleToEducator);
educatorRouter.post("/add-course", protectEducator, upload.single("image"), addCourse);
educatorRouter.get("/my-courses", protectEducator, getEducatorCourses);
educatorRouter.get("/dashboard", protectEducator, getEducatorData);
educatorRouter.get("/enrolled-students", protectEducator, getEnrolledStudents);

export default educatorRouter; 