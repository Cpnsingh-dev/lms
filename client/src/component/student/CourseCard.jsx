import React, { useContext } from 'react'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'
import { Link } from 'react-router-dom'

const CourseCard = ({ course }) => {

    const { currency, calculateRating, getAverageRating } = useContext(AppContext)

    // Calculate rating safely
    const ratingFn = calculateRating || getAverageRating
    const avgRating = ratingFn ? ratingFn(course) : 0
    const ratingsCount = course?.courseRatings?.length || 0

    // Price calculation
    const hasDiscount = Boolean(course?.discount && course.discount > 0)
    const finalPrice = hasDiscount
        ? (course.coursePrice - (course.discount * course.coursePrice) / 100).toFixed(2)
        : (course?.coursePrice ? course.coursePrice.toFixed(2) : '0.00')

    return (
        <Link
            to={`/course/${course._id}`}
            onClick={() => scrollTo(0, 0)}
            className='border border-gray-500/30 pb-6 overflow-hidden rounded-lg text-left hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-white flex flex-col justify-between group h-full'
        >
            <div className='overflow-hidden aspect-video bg-gray-100'>
                <img
                    className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                    src={course.courseThumbnail}
                    alt={course.courseTitle}
                />
            </div>
            <div className='p-3 text-left flex flex-col gap-1'>
                <h3 className='text-base font-semibold text-gray-900 line-clamp-2 leading-snug'>{course.courseTitle}</h3>
                <p className='text-gray-500 text-sm truncate'>{course.educator?.name || 'Chandra'}</p>
                <div className='flex items-center space-x-2 my-0.5'>
                    <p className='text-sm font-semibold text-gray-800'>{avgRating > 0 ? avgRating.toFixed(1) : '0'}</p>
                    <div className='flex items-center gap-0.5'>
                        {[...Array(5)].map((_, i) => (
                            <img
                                key={i}
                                src={i < Math.floor(avgRating) ? assets.star : assets.star_blank}
                                alt="star"
                                className='w-3.5 h-3.5'
                            />
                        ))}
                    </div>
                    <p className='text-gray-500 text-xs'>({ratingsCount})</p>
                </div>
                <div className='flex items-baseline space-x-2 pt-1'>
                    <p className='text-base font-semibold text-gray-800'>{currency || '$'}{finalPrice}</p>
                    {hasDiscount && (
                        <p className='text-sm text-gray-400 line-through'>{currency || '$'}{course.coursePrice.toFixed(2)}</p>
                    )}
                </div>
            </div>
        </Link>
    )
}

export default CourseCard