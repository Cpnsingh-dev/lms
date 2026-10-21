import React, { useContext } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../../component/educator/Navbar'
import Sidebar from '../../component/educator/Sidebar'
import Footer from '../../component/educator/Footer'
import { AppContext } from '../../context/AppContext'
import { useUser } from '@clerk/clerk-react'

const Educator = () => {
    const { isEducator, becomeEducator, navigate } = useContext(AppContext);
    const { user } = useUser();

    if (!user) {
        return (
            <div className='min-h-screen flex flex-col justify-between'>
                <Navbar />
                <div className='flex flex-col items-center justify-center p-8 my-auto text-center'>
                    <h2 className='text-2xl font-bold text-gray-800 mb-2'>Sign In Required</h2>
                    <p className='text-gray-500 mb-6'>Please sign in with your account to access the Educator Portal.</p>
                    <button
                        onClick={() => navigate('/')}
                        className='px-6 py-2.5 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition cursor-pointer'
                    >
                        Back to Home
                    </button>
                </div>
                <Footer />
            </div>
        );
    }

    if (!isEducator) {
        return (
            <div className='min-h-screen flex flex-col justify-between'>
                <Navbar />
                <div className='flex flex-col items-center justify-center p-8 my-auto text-center max-w-lg mx-auto'>
                    <div className='w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl mb-4'>
                        🎓
                    </div>
                    <h2 className='text-2xl font-bold text-gray-800 mb-2'>Become an Educator</h2>
                    <p className='text-gray-500 mb-6'>
                        Share your knowledge and start teaching students worldwide. Upgrade your account to an educator account with one click to publish courses and track your earnings!
                    </p>
                    <button
                        onClick={becomeEducator}
                        className='px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition shadow-md cursor-pointer'
                    >
                        Upgrade to Educator Role
                    </button>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className='text-default min-h-screen bg-white'>
            <Navbar />
            <div className='flex'>
                <Sidebar />
                <div className='flex-1 min-w-0'>
                    <Outlet />
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Educator