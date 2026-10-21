import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { Line } from 'rc-progress'
import Footer from '../../component/student/Footer'
import { useSearchParams } from 'react-router-dom'

const MyEnrollments = () => {

    const { enrolledCourses, fetchUserEnrolledCourses, navigate, setEnrolledCourses, courseDuration, totalLecture, backendUrl } = useContext(AppContext)
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const sessionId = searchParams.get('session_id');
        if (sessionId) {
            const apiBase = backendUrl || 'http://localhost:5000';
            fetch(`${apiBase}/api/user/verify-purchase`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId })
            })
                .then(() => fetchUserEnrolledCourses())
                .catch(err => console.error("Session verification in MyEnrollments failed:", err));
        } else {
            fetchUserEnrolledCourses();
        }
    }, [searchParams, backendUrl]);

    const [progressArray, setProgressArray] = useState([
        { lectureCompleted: 4, lectureTotal: 10, },
        { lectureCompleted: 2, lectureTotal: 5, },
        { lectureCompleted: 6, lectureTotal: 9, },
        { lectureCompleted: 7, lectureTotal: 10, },
        { lectureCompleted: 5, lectureTotal: 12, },
        { lectureCompleted: 0, lectureTotal: 8, },
        { lectureCompleted: 9, lectureTotal: 12, },
        { lectureCompleted: 9, lectureTotal: 9, },
        { lectureCompleted: 4, lectureTotal: 5, },
        { lectureCompleted: 3, lectureTotal: 10, },
        { lectureCompleted: 7, lectureTotal: 8, },
        { lectureCompleted: 2, lectureTotal: 6, },
        { lectureCompleted: 4, lectureTotal: 7, },
        { lectureCompleted: 9, lectureTotal: 10, },
        { lectureCompleted: 4, lectureTotal: 4, }
    ])

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
                        {enrolledCourses?.map((course, idx) => {
                            const progress = progressArray[idx];
                            const isCompleted = progress && progress.lectureCompleted >= progress.lectureTotal;
                            const percent = progress && progress.lectureTotal > 0
                                ? Math.round((progress.lectureCompleted * 100) / progress.lectureTotal)
                                : 0;

                            return (
                                <tr key={idx} className='border-b border-gray-500/20'>
                                    <td className='md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3'>
                                        <img src={course.courseThumbnail} alt="" className='w-14 sm:w-24 md:w-28 rounded' />
                                        <div className='flex-1'>
                                            <p className='mb-1 max-sm:text-sm font-medium text-gray-800'>{course.courseTitle}</p>
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
                                        {progress ? `${progress.lectureCompleted} out of ${progress.lectureTotal}` : '0 out of 0'}{' '}
                                        <span className='text-xs text-gray-500'>Lectures</span>
                                    </td>
                                    <td className='px-4 py-3 max-sm:text-right'>
                                        <button
                                            onClick={() => navigate('/player/' + course._id)}
                                            className={`px-3 sm:px-5 py-1.5 sm:py-2 max-sm:text-xs text-white rounded transition cursor-pointer ${isCompleted
                                                ? 'bg-green-600 hover:bg-green-700'
                                                : 'bg-blue-600 hover:bg-blue-700'
                                                }`}
                                        >
                                            {isCompleted ? 'Completed' : 'On Going'}
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <Footer />
        </>
    )
}

export default MyEnrollments