import Course from "../models/Course.js";


//api to get all courses
export const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find({
            isPublished: true
        }).select(["-courseContent", "-enrolledStudents"]).populate({ path: "educator" })

        if (!courses) {
            return res.json({ success: false, message: "no courses found" })
        }
        return res.json({
            success: true,
            message: "courses fetched successfully",
            courses: courses
        })

    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message })
    }
}

//Get course by id
export const getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate({ path: "educator" })
        if (!course) {
            return res.json({ success: false, message: "course not found" })
        }

        const auth = typeof req.auth === 'function' ? req.auth() : req.auth;
        const userId = auth?.userId || req.headers['user-id'];

        const isEducator = course.educator?._id?.toString() === userId?.toString();
        const isEnrolled = course.enrolledStudents?.some(s => s?.toString() === userId?.toString());

        // Convert to plain object to attach courseRatings alias
        const courseObj = course.toObject();
        courseObj.courseRatings = courseObj.courseRating || [];

        // If not enrolled and not educator, remove lecture url if isPreviewFree is false
        if (!isEducator && !isEnrolled && courseObj.courseContent) {
            courseObj.courseContent.forEach((chapter) => {
                if (chapter.chapterContent) {
                    chapter.chapterContent.forEach((lecture) => {
                        if (!lecture.isPreviewFree) {
                            lecture.lectureUrl = "";
                        }
                    })
                }
            })
        }

        return res.json({
            success: true,
            message: "course fetched successfully",
            course: courseObj
        })
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message })
    }
}
