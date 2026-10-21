import React from 'react'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'

const CallToAction = () => {
    const navigate = useNavigate();
    return (
        <div className='flex flex-col items-center gap-4 pt-10 pb-24 px-8 md:px-0 text-center'>
            <h1 className='text-xl md:text-4xl text-gray-800 font-semibold'>Learn anything, anytime, anywhere</h1>
            <p className='text-gray-500 sm:text-sm'>Ready to start learning? Explore our courses, build new skills, and take the next step toward achieving your goals.</p>
            <div className='flex items-center font-medium gap-6 mt-4'>
                <button onClick={() => { navigate('/course-list'); window.scrollTo(0, 0); }} className='px-10 py-3 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition cursor-pointer shadow'>Get started</button>
                <button onClick={() => { navigate('/course-list'); window.scrollTo(0, 0); }} className='flex items-center gap-2 text-gray-700 hover:text-blue-600 transition cursor-pointer'>Learn more <img src={assets.arrow_icon} alt="arrow" />
                </button>
            </div>
        </div>
    )
}

export default CallToAction