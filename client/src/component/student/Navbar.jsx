import React, { useContext } from 'react'
import { assets } from '../../assets/assets'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useClerk, UserButton, useUser } from '@clerk/react'
import { AppContext } from '../../context/AppContext'

const Navbar = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const isCourseListPage = location.pathname.includes('/course-list');
    const { isEducator } = useContext(AppContext)

    const { openSignIn } = useClerk()
    const { user } = useUser()

    return (
        <div className={`flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 border-b border-gray-500 py-3 sm:py-4 ${isCourseListPage ? 'bg-white' : 'bg-cyan-100/70'}`}>
            <img onClick={() => navigate('/')} src={assets.logo} alt="logo" className='w-24 sm:w-28 lg:w-32 cursor-pointer shrink-0' />
            <div className='hidden md:flex items-center gap-5 text-gray-500'>
                <div className='flex items-center gap-5'>
                    {user && (
                        <>
                            <button onClick={() => navigate('/educator')} className='hover:text-gray-800 transition'>{isEducator ? 'Educator Dashboard' : 'Become Educator'}</button>
                            {isEducator ? null : <span className='text-gray-400'>|</span>}
                            <Link to='/my-enrollments' className='hover:text-gray-800 transition'>My Enrollments</Link>
                        </>
                    )}
                </div>
                {user ? (
                    <UserButton />
                ) : (
                    <button onClick={() => openSignIn()} className='bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition font-medium'>Create Account</button>
                )}
            </div>
            {/* Phone Screen Device */}
            <div className='md:hidden flex items-center gap-2 sm:gap-5 text-gray-500 shrink-0'>
                <div className='flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs whitespace-nowrap'>
                    {user && (
                        <>
                            <button onClick={() => navigate('/educator')} className='hover:text-gray-800 transition'>{isEducator ? 'Educator Dashboard' : 'Become Educator'}</button>
                            {isEducator ? null : <span className='text-gray-400'>|</span>}
                            <Link to='/my-enrollments' className='hover:text-gray-800 transition'>My Enrollments</Link>
                        </>
                    )}
                </div>
                {user ? (
                    <UserButton />
                ) : (
                    <button onClick={() => openSignIn()} className='bg-blue-600 text-white px-3.5 py-1.5 rounded-full text-xs font-medium hover:bg-blue-700 transition active:scale-95 shadow-sm flex items-center gap-1.5'>
                        <img src={assets.user_icon} alt="user" className='w-3.5 h-3.5 brightness-0 invert' />
                        <span>Create Account</span>
                    </button>
                )}
            </div>
        </div>
    )
}

export default Navbar