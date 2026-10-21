import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { Line } from 'rc-progress'
import Footer from '../../component/student/Footer'

const MyEnrollments = () => {

    const { enrolledCourses, fetchUserEnrolledCourses, navigate, courseDuration, totalLecture, fetchCourseProgress } = useContext(AppContext)

    const [progressMap, setProgressMap] = useState({})

    useEffect(() => {
        fetchUserEnrolledCourses();
    }, [])

    useEffect(() => {
        const loadAllProgress = async () => {
            if (enrolledCourses && enrolledCourses.length > 0) {
                const map = {};
                for (const course of enrolledCourses) {
                    const prog = await fetchCourseProgress(course._id);
                    if (prog && Array.isArray(prog.lectureCompleted)) {
                        map[course._id] = prog.lectureCompleted;
                    }
                }
                setProgressMap(map);
            }
        };
        loadAllProgress();
    }, [enrolledCourses])

    return (
        <>
            <div className='md:px-36 px-8 pt-10 pb-16 min-h-[calc(100vh-200px)]'>
                <h1 className='text-2xl md:text-3xl font-semibold text-gray-800'>My Enrollments</h1>
                <table className='md:table-auto table-fixed w-full overflow-hidden border border-gray-500/20 mt-10'>
                    <thead className='text-gray-900 border-b border-gray-500/20 text-sm text-left max-sm:hidden'>
                        <tr>
                            <th className='px-4 py-3 font-semibold truncate'>Course</th>
                            <th className='px-4 py-3 font-semibold truncate'>Duration</th>
                            <th className='px-4 py-3 font-semibold truncate'>Completed</th>
                            <th className='px-4 py-3 font-semibold truncate'>Status</th>
                        </tr>
                    </thead>
                    <tbody className='text-gray-700'>
                        {enrolledCourses && enrolledCourses.length > 0 ? (
                            enrolledCourses.map((course, idx) => {
                                const completedCount = progressMap[course._id]?.length || 0;
                                const totalCount = totalLecture(course) || 0;
                                const isCompleted = totalCount > 0 && completedCount >= totalCount;
                                const percent = totalCount > 0
                                    ? Math.min(100, Math.round((completedCount * 100) / totalCount))
                                    : 0;

                                return (
                                    <tr key={course._id || idx} className='border-b border-gray-500/20'>
                                        <td className='md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3'>
                                            <img src={course.courseThumbnail} alt="" className='w-14 sm:w-24 md:w-28 rounded object-cover aspect-video' />
                                            <div className='flex-1 min-w-0'>
                                                <p className='mb-1 max-sm:text-sm font-medium text-gray-800 truncate'>{course.courseTitle}</p>
                                                <Line
                                                    strokeWidth={2}
                                                    percent={percent}
                                                    className='bg-gray-300 rounded-full'
                                                />
                                            </div>
                                        </td>
                                        <td className='px-4 py-3 max-sm:hidden'>
                                            {courseDuration(course)}
                                        </td>
                                        <td className='px-4 py-3 max-sm:hidden'>
                                            {completedCount} out of {totalCount}{' '}
                                            <span className='text-xs text-gray-500'>Lectures</span>
                                        </td>
                                        <td className='px-4 py-3 max-sm:text-right'>
                                            <button
                                                onClick={() => navigate('/player/' + course._id)}
                                                className={`px-3 sm:px-5 py-1.5 sm:py-2 max-sm:text-xs text-white rounded transition cursor-pointer font-medium ${isCompleted
                                                    ? 'bg-green-600 hover:bg-green-700'
                                                    : 'bg-blue-600 hover:bg-blue-700'
                                                    }`}
                                            >
                                                {isCompleted ? 'Completed' : 'On Going'}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan='4' className='text-center py-12 text-gray-500'>
                                    <p className='text-base font-medium text-gray-700'>You haven't enrolled in any courses yet.</p>
                                    <button
                                        onClick={() => navigate('/course-list')}
                                        className='mt-3 px-5 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition cursor-pointer'
                                    >
                                        Browse Courses
                                    </button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <Footer />
        </>
    )
}

export default MyEnrollments