import { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react";
import humanizeDuration from 'humanize-duration';

export const AppContext = createContext()

export const AppContextProvider = (props) => {

    const currency = import.meta.env.VITE_CURRENCY
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

    const [allCourses, setAllCourses] = useState([]);
    const [isEducator, setIsEducator] = useState(true);
    const [enrolledCourses, setEnrolledCourses] = useState([]);

    const navigate = useNavigate();
    const { getToken } = useAuth();
    const { user } = useUser();

    //api call to fetch all courses
    const fetchCourses = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/course/all`);
            const data = await response.json();
            if (data.success && Array.isArray(data.courses) && data.courses.length > 0) {
                setAllCourses(data.courses);
            } else {
                setAllCourses(dummyCourses);
            }
        } catch (error) {
            console.error("fetchCourses error, using fallback dummyCourses:", error);
            setAllCourses(dummyCourses);
        }
    }


    // function to calculate average rating 
    const calculateRating = (course) => {
        if (!course?.courseRatings || course.courseRatings.length === 0) {
            return 0
        }
        let sum = 0
        course.courseRatings.forEach(rating => {
            sum += rating.rating
        })
        return sum / course.courseRatings.length
    }

    const getAverageRating = calculateRating

    //function to cal course chapter type
    const calculateChapterTime = (chapter) => {
        let time = 0;
        chapter.chapterContent.map((lecture) => {
            time += lecture.lectureDuration;
        })
        return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
    }

    //function to cal the course duration 
    const courseDuration = (course) => {
        let time = 0;
        course?.courseContent?.map((chapter) => chapter?.chapterContent?.map((lecture) => time += lecture?.lectureDuration))
        return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
    }

    //function to cal total num of no. of lecture
    const totalLecture = (course) => {
        let count = 0;
        course?.courseContent.forEach(chapter => {
            if (Array.isArray(chapter.chapterContent)) {
                count += chapter.chapterContent.length;
            }
        })
        return count
    }

    //fetch user enrolled courses
    const fetchUserEnrolledCourses = async () => {
        if (!user) {
            setEnrolledCourses(dummyCourses);
            return;
        }

        try {
            const token = await getToken();
            const headers = {
                'user-id': user.id
            };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`${backendUrl}/api/user/enrolled`, { headers });
            const data = await response.json();

            if (data.success && Array.isArray(data.enrolledCourses)) {
                setEnrolledCourses(data.enrolledCourses);
            } else {
                setEnrolledCourses(dummyCourses);
            }
        } catch (error) {
            console.error("fetchUserEnrolledCourses error, using fallback:", error);
            setEnrolledCourses(dummyCourses);
        }
    }

    useEffect(() => {
        fetchCourses();
    }, [])

    useEffect(() => {
        if (user) {
            fetchUserEnrolledCourses();
        } else {
            fetchUserEnrolledCourses();
        }
    }, [user])

    const value = {
        currency, backendUrl, allCourses, navigate, calculateRating, getAverageRating, calculateChapterTime, courseDuration, totalLecture, isEducator, setIsEducator, enrolledCourses, fetchUserEnrolledCourses, setEnrolledCourses, getToken, user
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

