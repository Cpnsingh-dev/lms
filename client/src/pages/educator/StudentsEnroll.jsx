import React, { useEffect, useState } from 'react'
import { dummyStudentEnrolled } from '../../assets/assets'
import Loading from '../../component/student/Loading'

const StudentsEnroll = () => {

    const [allStudents, setAllStudents] = useState(null)

    const fetchEnrolledStudents = async () => {
        setAllStudents(dummyStudentEnrolled);
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
                                {allStudents.map((i, idx) => (
                                    <tr key={idx} className='border-b border-gray-500/20'>
                                        <td className='px-4 py-3 text-center hidden sm:table-cell'>{idx + 1}</td>
                                        <td className='md:px-4 px-3 py-3 flex items-center space-x-3'>
                                            <img src={i.student.imageUrl} alt="" className='w-9 h-9 rounded-full shrink-0' />
                                            <span className='truncate'>{i.student.name}</span>
                                        </td>
                                        <td className='md:px-4 px-3 py-3 truncate'>{i.courseTitle}</td>
                                        <td className='px-4 py-3 hidden sm:table-cell'>{new Date(i.purchaseDate).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    ) : <Loading />
}

export default StudentsEnroll