import { clerkClient } from "@clerk/express"
import Course from "../models/Course.js";
import { v2 as cloudinary } from "cloudinary"
import Purchase from "../models/Purchase.js";
import User from "../models/User.js";

export const updateRoleToEducator = async (req, res) => {
    try {
        const auth = typeof req.auth === 'function' ? req.auth() : req.auth;
        const userId = auth?.userId;

        if (!userId) {
            return res.json({ success: false, message: "Unauthorized: User not authenticated" });
        }

        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: {
                role: "educator"
            }
        })
        res.json({ success: true, message: "You can Publish a course now" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}


//api to add new course
export const addCourse = async (req, res) => {
    try {
        const { courseData } = req.body;
        const imagefile = req.file;

        const auth = typeof req.auth === 'function' ? req.auth() : req.auth;
        const educatorId = auth?.userId || req.headers['user-id'];

        if (!imagefile) {
            return res.json({ success: false, message: "thumbnail not attached " })
        }

        const parsedCourseData = await JSON.parse(courseData);
        parsedCourseData.educator = educatorId;

        const newCourse = await Course.create(parsedCourseData)

        const imageUpload = await cloudinary.uploader.upload(imagefile.path, {
            folder: "courses",
            resource_type: "image"
        })

        newCourse.courseThumbnail = imageUpload.secure_url;
        await newCourse.save();

        res.json({ success: true, message: "Course added successfully", courseId: newCourse._id })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

//get educator courses
export const getEducatorCourses = async (req, res) => {
    try {
        const auth = typeof req.auth === 'function' ? req.auth() : req.auth;
        const educator = auth?.userId;

        const courses = await Course.find({ educator: educator })
        res.json({ success: true, message: "Educator courses fetched successfully", courses })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

//api to get all data of educator of eduactor dashboard
export const getEducatorData = async (req, res) => {
    try {
        const auth = typeof req.auth === 'function' ? req.auth() : req.auth;
        const educatorId = auth?.userId || req.headers['user-id'];

        const courses = await Course.find({ educator: educatorId })
        const totalCourses = courses.length;

        const courseIds = courses.map(course => course._id);

        //total Earning 
        const purchases = await Purchase.find({
            courseId: { $in: courseIds },
            status: "Completed"
        }).select("amount")
        const totalEarning = purchases.reduce((total, purchase) => total + purchase.amount, 0);

        //uniqe student data enrolled in this course
        const enrolledStudents = [];
        for (const course of courses) {
            const students = await User.find({
                _id: { $in: course.enrolledStudents },
            }, "name imageUrl")

            students.forEach(student => {
                enrolledStudents.push({
                    courseTitle: course.courseTitle,
                    student: student
                })
            })
        }
        res.json({
            success: true,
            message: "dashboard data fetched successfully",
            dashboardData: {
                courses: courses,
                totalCourses: totalCourses,
                totalEarning: totalEarning,
                enrolledStudents: enrolledStudents
            }
        })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}


//Get Enrolled Students data with Purchase Data
export const getEnrolledStudents = async (req, res) => {
    try {
        const auth = typeof req.auth === 'function' ? req.auth() : req.auth;
        const educatorId = auth?.userId || req.headers['user-id'];

        const courses = await Course.find({ educator: educatorId })

        const courseIds = courses.map(course => course._id);
        const purchases = await Purchase.find({
            courseId: { $in: courseIds },
            status: "Completed"
        })
            .populate("userId", "name imageUrl")
            .populate("courseId", "courseTitle")

        const enrolledStudents = purchases.map(purchase => ({
            student: purchase.userId,
            courseTitle: purchase.courseId.courseTitle,
            purchaseDate: purchase.createdAt
        }))

        res.json({
            success: true,
            message: "Enrolled students data fetched successfully",
            enrolledStudents
        })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}
