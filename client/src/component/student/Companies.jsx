import React from 'react'
import { assets } from '../../assets/assets'

const Companies = () => {
    return (
        <div className='pt-8 md:pt-14 text-center w-full'>
            <p className='text-sm sm:text-base text-gray-500 font-medium'>Trusted by learners from</p>
            <div className='flex flex-wrap items-center justify-center gap-6 sm:gap-10 md:gap-16 mt-6 md:mt-10'>
                <img src={assets.microsoft_logo} alt="Microsoft" className='w-20 md:w-28 object-contain hover:scale-105 transition-transform duration-300' />
                <img src={assets.walmart_logo} alt="Walmart" className='w-20 md:w-28 object-contain hover:scale-105 transition-transform duration-300' />
                <img src={assets.accenture_logo} alt="Accenture" className='w-20 md:w-28 object-contain hover:scale-105 transition-transform duration-300' />
                <img src={assets.adobe_logo} alt="Adobe" className='w-20 md:w-28 object-contain hover:scale-105 transition-transform duration-300' />
                <img src={assets.paypal_logo} alt="Paypal" className='w-20 md:w-28 object-contain hover:scale-105 transition-transform duration-300' />
            </div>
        </div>
    )
}

export default Companies