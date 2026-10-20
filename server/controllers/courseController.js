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
        //remove lecture url if isPreviewFree is False
        course.courseContent.forEach((chapter) => {
            chapter.chapterContent.forEach((lecture) => {
                if (!lecture.isPreviewFree) {
                    lecture.lectureUrl = "";
                }
            })
        })
        if (!course) {
            return res.json({ success: false, message: "course not found" })
        }
        return res.json({
            success: true,
            message: "course fetched successfully",
            course: course
        })


    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message })
    }
}
