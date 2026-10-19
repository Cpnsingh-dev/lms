import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import CourseCard from './CourseCard'

const CoursesSection = () => {

    const { allCourses } = useContext(AppContext)

    return (
        <div className='py-16 px-6 sm:px-10 md:px-14 lg:px-20 xl:px-40 text-center'>
            <h2 className='text-3xl font-medium text-gray-800'>Learn from the best</h2>
            <p className='text-sm md:text-base text-gray-500 mt-3 max-w-2xl mx-auto'>
                Explore a wide range of courses designed to help you learn new skills, strengthen your knowledge, and achieve your goals. Choose a course that interests you and start learning at your own pace.
            </p>

            <div className='mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                {allCourses.slice(0, 4).map((course, index) => (
                    <CourseCard key={course._id || index} course={course} />
                ))}
            </div>

            <Link to="/course-list" onClick={() => scrollTo(0, 0)} className='text-gray-500 border border-gray-500/30 px-10 py-3 rounded inline-block mt-8 md:mt-10 hover:bg-gray-50 hover:text-gray-800 hover:border-gray-400 transition'>Browse All Courses</Link>
        </div>
    )
}

export default CoursesSection