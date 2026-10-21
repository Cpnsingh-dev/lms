import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import Loading from '../../component/student/Loading';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const MyCourses = () => {

    const { currency, backenedUrl, getToken } = useContext(AppContext);

    const [courses, setCourses] = useState(null);

    const fetchEducatorCourses = async () => {
        try {
            const token = await getToken();
            const { data } = await axios.get(backenedUrl + "/api/educator/my-courses", {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data.success && data.courses) {
                setCourses(data.courses);
            } else {
                toast.error(data.message || "Failed to fetch courses");
            }
        } catch (error) {
            console.error("fetchEducatorCourses error:", error);
            toast.error(error.message);
        }
    }

    useEffect(() => {
        fetchEducatorCourses();
    }, [])

    return courses ? (
        <div className='min-h-screen flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0'>
            <div className='w-full'>
                <div className='flex items-center justify-between pb-4 max-w-4xl'>
                    <h2 className='text-lg font-medium text-gray-800'>My Courses</h2>
                    <Link
                        to='/educator/add-course'
                        className='px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition'
                    >
                        Add New Course
                    </Link>
                </div>
                <div className='flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20'>
                    <div className='w-full overflow-x-auto'>
                        <table className='md:table-auto table-fixed w-full overflow-hidden'>
                            <thead className='text-gray-900 border-b border-gray-500/20 text-sm text-left'>
                                <tr>
                                    <th className='px-3 md:px-4 py-3 font-semibold truncate'>All Courses</th>
                                    <th className='px-3 md:px-4 py-3 font-semibold truncate'>Earnings</th>
                                    <th className='px-3 md:px-4 py-3 font-semibold truncate'>Students</th>
                                    <th className='px-3 md:px-4 py-3 font-semibold truncate'>Published On</th>
                                </tr>
                            </thead>
                            <tbody className='text-sm text-gray-500'>
                                {courses.length > 0 ? (
                                    courses.map((course) => {
                                        const enrolledCount = course.enrolledStudents?.length || 0;
                                        const finalPrice = course.coursePrice - (course.discount * course.coursePrice / 100);
                                        const totalEarnings = enrolledCount * finalPrice;

                                        return (
                                            <tr key={course._id} className='border-b border-gray-500/20'>
                                                <td className='md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate'>
                                                    <img src={course.courseThumbnail} alt="Course Image" className='w-14 sm:w-16 rounded shrink-0 aspect-video object-cover' />
                                                    <span className='truncate font-medium text-gray-800'>{course.courseTitle}</span>
                                                </td>
                                                <td className='px-3 md:px-4 py-3'>
                                                    {currency} {totalEarnings.toFixed(2)}
                                                </td>
                                                <td className='px-3 md:px-4 py-3'>
                                                    {enrolledCount}
                                                </td>
                                                <td className='px-3 md:px-4 py-3'>
                                                    {course.createdAt ? new Date(course.createdAt).toLocaleDateString() : 'N/A'}
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan='4' className='text-center py-10 text-gray-500'>
                                            <p className='font-medium text-gray-700'>You haven't created any courses yet.</p>
                                            <Link
                                                to='/educator/add-course'
                                                className='mt-3 inline-block px-4 py-2 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 transition'
                                            >
                                                Create Your First Course
                                            </Link>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    ) : <Loading />
}

export default MyCourses