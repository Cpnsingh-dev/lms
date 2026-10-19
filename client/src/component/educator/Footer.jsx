import React from 'react'
import { assets } from '../../assets/assets'

const Footer = () => {
    return (
        <footer className='flex md:flex-row flex-col-reverse items-center justify-between text-center md:text-left w-full px-4 md:px-8 py-4 border-t border-gray-500/20 gap-4'>
            <div className='flex items-center gap-3'>
                <img src={assets.logo} alt="" className='w-20 lg:w-28' />
                <div className='hidden md:block h-7 w-px bg-gray-500/60'></div>
                <p className='text-xs lg:text-sm text-gray-500'>© 2025 All rights reserved. Created with ❤️ by GreatStack</p>
            </div>

            <div className='flex items-center gap-3'>
                <a href="#"><img src={assets.facebook_icon} alt="" /></a>
                <a href="#"><img src={assets.twitter_icon} alt="" /></a>
                <a href="#"><img src={assets.instagram_icon} alt="" /></a>
            </div>
        </footer>
    )
}

export default Footer