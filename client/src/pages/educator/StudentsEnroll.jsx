import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../../assets/assets'
import Loading from '../../component/student/Loading'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const StudentsEnroll = () => {

    const { backenedUrl, getToken } = useContext(AppContext);
    const [allStudents, setAllStudents] = useState(null)

    const fetchEnrolledStudents = async () => {
        try {
            const token = await getToken();
            const { data } = await axios.get(backenedUrl + "/api/educator/enrolled-students", {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data.success && data.enrolledStudents) {
                setAllStudents(data.enrolledStudents);
            } else {
                toast.error(data.message || "Failed to fetch enrolled students");
            }
        } catch (error) {
            console.error("fetchEnrolledStudents error:", error);
            toast.error(error.message);
        }
    }

    useEffect(() => {
        fetchEnrolledStudents();
    }, [])

    return allStudents ? (
        <div className='min-h-screen flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0'>
            <div className='w-full'>
                <h2 className='pb-4 text-lg font-medium text-gray-800'>Students Enrolled</h2>
                <div className='flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20'>
                    <div className='w-full overflow-x-auto'>
                        <table className='table-fixed md:table-auto w-full overflow-hidden pb-4'>
                            <thead className='text-gray-900 border-b border-gray-500/20 text-sm text-left'>
                                <tr>
                                    <th className='px-4 py-3 font-semibold text-center hidden sm:table-cell'>#</th>
                                    <th className='md:px-4 px-3 py-3 font-semibold'>Student Name</th>
                                    <th className='md:px-4 px-3 py-3 font-semibold'>Course Title</th>
                                    <th className='px-4 py-3 font-semibold hidden sm:table-cell'>Date</th>
                                </tr>
                            </thead>
                            <tbody className='text-sm text-gray-500'>
                                {allStudents.length > 0 ? (
                                    allStudents.map((i, idx) => (
                                        <tr key={idx} className='border-b border-gray-500/20'>
                                            <td className='px-4 py-3 text-center hidden sm:table-cell'>{idx + 1}</td>
                                            <td className='md:px-4 px-3 py-3 flex items-center space-x-3'>
                                                <img src={i.student?.imageUrl || assets.profile_img} alt="" className='w-9 h-9 rounded-full shrink-0' />
                                                <span className='truncate'>{i.student?.name || i.student?.fullName || 'Student'}</span>
                                            </td>
                                            <td className='md:px-4 px-3 py-3 truncate'>{i.courseTitle}</td>
                                            <td className='px-4 py-3 hidden sm:table-cell'>{i.purchaseDate ? new Date(i.purchaseDate).toLocaleDateString() : 'N/A'}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan='4' className='text-center py-10 text-gray-500'>
                                            No enrolled students found yet.
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

export default StudentsEnroll