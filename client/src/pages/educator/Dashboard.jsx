import React, { useContext, useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { AppContext } from '../../context/AppContext';
import { assets, dummyDashboardData } from '../../assets/assets';
import Loading from '../../component/student/Loading';

const Dashboard = () => {

    const [dashboardData, setDashboardData] = useState(null);
    const { currency } = useContext(AppContext);

    const fetchDashData = async () => {
        setDashboardData(dummyDashboardData);
    }

    useEffect(() => {
        fetchDashData();
    }, [])

    return dashboardData ? (
        <div className='min-h-screen flex flex-col items-start justify-between gap-8 md:p-8 md:pb-0 p-4 pt-8 pb-0'>
            <div className='space-y-5 w-full'>
                <div className='flex flex-wrap gap-4 sm:gap-5 items-center'>
                    <div className='flex items-center gap-3 shadow-card border border-blue-500 p-4 w-full sm:w-56 rounded-md'>
                        <img src={assets.patients_icon} alt="patients-icon" />
                        <div>
                            <p className='text-2xl font-medium text-gray-600'>{dashboardData.enrolledStudentsData.length}</p>
                            <p className='text-base text-gray-500'>Enrolled Students</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-3 shadow-card border border-blue-500 p-4 w-full sm:w-56 rounded-md'>
                        <img src={assets.appointments_icon} alt="appointments-icon" />
                        <div>
                            <p className='text-2xl font-medium text-gray-600'>{dashboardData.totalCourses}</p>
                            <p className='text-base text-gray-500'>Total Courses</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-3 shadow-card border border-blue-500 p-4 w-full sm:w-56 rounded-md'>
                        <img src={assets.earning_icon} alt="earning-icon" />
                        <div>
                            <p className='text-2xl font-medium text-gray-600'>{currency}{dashboardData.totalEarnings.toFixed(2)}</p>
                            <p className='text-base text-gray-500'>Total Earnings</p>
                        </div>
                    </div>
                </div>

                <div className='w-full'>
                    <h2 className='pb-4 text-lg font-medium text-gray-800'>Latest Enrollments</h2>
                    <div className='flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20'>
                        <div className='w-full overflow-x-auto'>
                            <table className='table-fixed md:table-auto w-full overflow-hidden'>
                                <thead className='text-gray-900 border-b border-gray-500/20 text-sm text-left'>
                                    <tr>
                                        <th className='px-4 py-3 font-semibold text-center hidden sm:table-cell'>#</th>
                                        <th className='md:px-4 px-3 py-3 font-semibold'>Student Name</th>
                                        <th className='md:px-4 px-3 py-3 font-semibold'>Course Title</th>
                                    </tr>
                                </thead>
                                <tbody className='text-sm text-gray-500'>
                                    {dashboardData.enrolledStudentsData.map((i, idx) => (
                                        <tr key={idx} className='border-b border-gray-500/20'>
                                            <td className='px-4 py-3 text-center hidden sm:table-cell'>
                                                {idx + 1}
                                            </td>
                                            <td className='md:px-4 px-3 py-3 flex items-center space-x-3'>
                                                <img src={i.student.imageUrl} alt="" className='w-9 h-9 rounded-full shrink-0' />
                                                <span className='truncate'>{i.student.name || i.student.fullName}</span>
                                            </td>
                                            <td className='md:px-4 px-3 py-3 truncate'>
                                                {i.courseTitle}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    ) : <Loading />
}

export default Dashboard