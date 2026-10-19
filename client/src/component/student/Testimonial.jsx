import React from 'react'
import { assets, dummyTestimonial } from '../../assets/assets'

const Testimonial = () => {
    return (
        <div className='pb-14 px-8 md:px-0 text-center w-full'>
            <h2 className='text-3xl font-medium text-gray-800'>Testimonials</h2>
            <p className='md:text-base text-gray-500 mt-3 max-w-2xl mx-auto'>
                This platform has made learning simple and enjoyable for me. The courses are well-organized, easy to understand,<br className='hidden md:block' /> and helped me improve my skills at my own pace.
            </p>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-14 max-w-5xl mx-auto'>
                {dummyTestimonial.map((t, i) => (
                    <div
                        key={i}
                        className='text-center border border-gray-500/20 pb-6 rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 bg-white flex flex-col justify-between h-full'
                    >
                        <div>
                            <div className='flex items-center gap-4 px-5 py-4 bg-gray-500/10 border-b border-gray-500/10'>
                                <img className='h-12 w-12 rounded-full object-cover border-2 border-white shadow-sm' src={t.image} alt={t.name} />
                                <div className='text-left'>
                                    <h1 className='text-base font-semibold text-gray-800'>{t.name}</h1>
                                    <p className='text-gray-500 text-xs'>{t.role}</p>
                                </div>
                            </div>
                            <div className='p-5 pb-4 text-left'>
                                <div className='flex items-center gap-0.5'>
                                    {[...Array(5)].map((_, i) => (
                                        <img className='h-4 w-4' src={i < Math.floor(t.rating) ? assets.star : assets.star_blank} alt="star" key={i} />
                                    ))}
                                </div>
                                <p className='text-gray-600 mt-4 text-sm leading-relaxed line-clamp-3'>
                                    "{t.feedback}"
                                </p>
                            </div>
                        </div>
                        <div className='text-left px-5'>
                            <a href="#" className='text-sm text-primary hover:text-blue-700 font-medium underline transition-colors'>
                                Read More...
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Testimonial