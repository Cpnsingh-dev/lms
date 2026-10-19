import React from 'react'
import { assets } from '../../assets/assets'
import SearchBar from './SearchBar'

const Hero = () => {
    return (
        <div className='flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto'>
            <h1 className='text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight relative'>
                Empower your future with the courses designed <span className='text-blue-600 relative inline-block'>
                    to fit your choice
                    <img src={assets.sketch} alt="sketch" className='md:block hidden absolute -bottom-7 right-0' />
                </span>
            </h1>
            <p className='md:block hidden text-gray-500 max-w-2xl mx-auto text-base sm:text-lg'>
                Learn, grow, and achieve your goals with our Learning Management System. Access engaging courses, track your progress, and build valuable skills—all in one simple and user-friendly platform.
            </p>
            <p className='md:hidden text-gray-500 max-w-sm mx-auto text-sm sm:text-base'>
                Empower your learning journey with a modern platform designed for students and educators
            </p>
            <SearchBar />
        </div>
    )
}

export default Hero