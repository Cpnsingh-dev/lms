import { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import humanizeDuration from 'humanize-duration';

export const AppContext = createContext()

export const AppContextProvider = (props) => {

    const currency = import.meta.env.VITE_CURRENCY

    const [allCourses, setAllCourses] = useState([]);
    const [isEducator, setIsEducator] = useState(true);
    const [enrolledCourses, setEnrolledCourses] = useState([]);

    const navigate = useNavigate();
    const fetchCourses = async () => {
        setAllCourses(dummyCourses)
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
        setEnrolledCourses(dummyCourses)
    }

    useEffect(() => {
        fetchCourses();
        fetchUserEnrolledCourses();
    }, [])

    const value = {
        currency, allCourses, navigate, calculateRating, getAverageRating, calculateChapterTime, courseDuration, totalLecture, isEducator, setIsEducator, enrolledCourses, fetchUserEnrolledCourses, setEnrolledCourses
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

