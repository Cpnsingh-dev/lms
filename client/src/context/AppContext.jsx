import { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react";
import humanizeDuration from 'humanize-duration';
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext()

export const AppContextProvider = (props) => {

    const currency = import.meta.env.VITE_CURRENCY

    const backenedUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_BACKENED_URL || 'http://localhost:5000';

    const [allCourses, setAllCourses] = useState([]);
    const [isEducator, setIsEducator] = useState(false);
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [userData, setUserData] = useState(null);
    const [isEnrolling, setIsEnrolling] = useState(false);
    const navigate = useNavigate();
    const { getToken } = useAuth();
    const { user } = useUser();



    //api call to fetch all courses
    const fetchCourses = async () => {
        try {
            const { data } = await axios.get(backenedUrl + "/api/course/get-courses")
            if (data.success) {
                setAllCourses(data.courses)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    //fundtion to fetch userData
    const fetchUserData = async () => {
        if (user?.publicMetadata?.role === "educator") {
            setIsEducator(true)
        }

        try {
            const token = await getToken();
            const { data } = await axios.get(backenedUrl + "/api/user/data", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (data.success) {
                const fetchedUser = data.userData || data.user;
                setUserData(fetchedUser);
                if (fetchedUser?.role === 'educator' || user?.publicMetadata?.role === 'educator') {
                    setIsEducator(true);
                }
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }


    // function to calculate average rating 
    const calculateRating = (course) => {
        const ratings = course?.courseRatings || course?.courseRating;
        if (!ratings || ratings.length === 0) {
            return 0
        }
        let sum = 0
        ratings.forEach(rating => {
            sum += (Number(rating.rating) || 0)
        })
        const avg = sum / ratings.length;
        return avg >= 1 ? Math.round(avg * 10) / 10 : 0;
    }

    const getAverageRating = calculateRating

    //function to cal course chapter type
    const calculateChapterTime = (chapter) => {
        let time = 0;
        chapter?.chapterContent?.forEach((lecture) => {
            time += (Number(lecture.lectureDuration) || 0);
        })
        return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
    }

    //function to cal the course duration 
    const courseDuration = (course) => {
        let time = 0;
        course?.courseContent?.forEach((chapter) =>
            chapter?.chapterContent?.forEach((lecture) => {
                time += (Number(lecture?.lectureDuration) || 0);
            })
        )
        return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
    }

    //function to cal total num of no. of lecture
    const totalLecture = (course) => {
        let count = 0;
        course?.courseContent?.forEach(chapter => {
            if (Array.isArray(chapter.chapterContent)) {
                count += chapter.chapterContent.length;
            }
        })
        return count
    }

    //fetch user enrolled courses
    const fetchUserEnrolledCourses = async () => {
        try {
            const token = await getToken()
            const { data } = await axios.get(backenedUrl + "/api/user/enrolled", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (data.success) {
                setEnrolledCourses(data.enrolledCourses ? [...data.enrolledCourses].reverse() : [])
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // Become educator API action
    const becomeEducator = async () => {
        try {
            const token = await getToken();
            const { data } = await axios.get(backenedUrl + "/api/educator/update-role", {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data.success) {
                setIsEducator(true);
                toast.success(data.message || "You are now an educator!");
                navigate('/educator');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // Purchase / Enroll course
    const enrollCourse = async (courseId) => {
        if (isEnrolling) return;
        try {
            if (!user) {
                toast.warn("Please log in to enroll");
                return;
            }
            setIsEnrolling(true);
            const token = await getToken();
            const { data } = await axios.post(
                backenedUrl + "/api/user/purchase",
                { courseId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        origin: window.location.origin
                    }
                }
            );
            if (data.success) {
                if (data.isFree) {
                    toast.success(data.message || "Enrolled successfully!");
                    await fetchUserEnrolledCourses();
                    navigate('/my-enrollments');
                    setIsEnrolling(false);
                } else if (data.session_url) {
                    window.location.href = data.session_url;
                }
            } else {
                toast.error(data.message);
                setIsEnrolling(false);
            }
        } catch (error) {
            toast.error(error.message);
            setIsEnrolling(false);
        }
    };

    // Update lecture progress
    const updateCourseProgress = async (courseId, lectureId) => {
        try {
            const token = await getToken();
            const { data } = await axios.post(
                backenedUrl + "/api/user/update-progress",
                { courseId, lectureId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (data.success) {
                toast.success(data.message);
                return true;
            } else {
                toast.error(data.message);
                return false;
            }
        } catch (error) {
            toast.error(error.message);
            return false;
        }
    };

    // Rate a course
    const rateCourse = async (courseId, rating) => {
        try {
            const token = await getToken();
            const { data } = await axios.post(
                backenedUrl + "/api/user/add-rating",
                { courseId, rating },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (data.success) {
                toast.success(data.message);
                await fetchCourses();
                return true;
            } else {
                toast.error(data.message);
                return false;
            }
        } catch (error) {
            toast.error(error.message);
            return false;
        }
    };

    // Fetch progress for a single course
    const fetchCourseProgress = async (courseId) => {
        try {
            const token = await getToken();
            const { data } = await axios.post(
                backenedUrl + "/api/user/get-progress",
                { courseId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (data.success) {
                return data.progress;
            }
            return null;
        } catch (error) {
            console.error("fetchCourseProgress error:", error);
            return null;
        }
    };

    useEffect(() => {
        fetchCourses();
    }, [])

    useEffect(() => {
        if (user) {
            fetchUserData();
            fetchUserEnrolledCourses();
        }
    }, [user])

    const value = {
        currency,
        allCourses,
        navigate,
        calculateRating,
        getAverageRating,
        calculateChapterTime,
        courseDuration,
        totalLecture,
        isEducator,
        enrolledCourses,
        fetchUserEnrolledCourses,
        setEnrolledCourses,
        backenedUrl,
        backendUrl: backenedUrl,
        userData,
        setUserData,
        fetchUserData,
        setIsEducator,
        getToken,
        fetchCourses,
        becomeEducator,
        enrollCourse,
        isEnrolling,
        updateCourseProgress,
        rateCourse,
        fetchCourseProgress
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

