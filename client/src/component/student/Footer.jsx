import React from 'react'
import { assets } from '../../assets/assets'

const Footer = () => {
    return (
        <footer className='bg-gray-900 border-t border-gray-800 text-left w-full mt-10'>
            <div className='max-w-7xl mx-auto px-6 sm:px-10 md:px-14 lg:px-20 py-12 md:py-16'>
                <div className='grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 pb-12 border-b border-gray-800'>
                    {/* Brand column */}
                    <div className='md:col-span-5 flex flex-col items-start'>
                        <img className='h-8 w-auto' src={assets.logo_dark} alt="logo" />
                        <p className='mt-5 text-sm text-gray-400 leading-relaxed max-w-sm'>
                            Empowering students and educators with seamless learning and teaching solutions. Creating a world-class learning experience for everyone.
                        </p>
                    </div>

                    {/* Quick links */}
                    <div className='md:col-span-3 flex flex-col items-start'>
                        <h2 className='text-sm font-semibold text-white uppercase tracking-wider mb-5'>Company</h2>
                        <ul className='space-y-3 text-sm'>
                            <li><a href="#" className='text-gray-400 hover:text-white transition-colors duration-200'>Home</a></li>
                            <li><a href="#" className='text-gray-400 hover:text-white transition-colors duration-200'>About us</a></li>
                            <li><a href="#" className='text-gray-400 hover:text-white transition-colors duration-200'>Contact us</a></li>
                            <li><a href="#" className='text-gray-400 hover:text-white transition-colors duration-200'>Privacy Policy</a></li>
                        </ul>
                    </div>

                    {/* Newsletter subscription */}
                    <div className='md:col-span-4 flex flex-col items-start'>
                        <h2 className='text-sm font-semibold text-white uppercase tracking-wider mb-5'>Subscribe to our Newsletter</h2>
                        <p className='text-sm text-gray-400 leading-relaxed mb-4'>
                            Get the latest news and updates delivered straight to your inbox.
                        </p>
                        <form onSubmit={(e) => e.preventDefault()} className='flex flex-col sm:flex-row items-center gap-2.5 w-full'>
                            <input
                                className='bg-gray-800/80 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white placeholder-gray-500 text-sm rounded-lg px-3.5 py-2.5 w-full outline-none transition-all duration-200'
                                type="email"
                                placeholder='Enter your email'
                                required
                            />
                            <button
                                type="submit"
                                className='bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors duration-200 w-full sm:w-auto shrink-0 shadow-sm'
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom copyright bar */}
                <div className='pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-3'>
                    <p>© 2026 Learning Management System. All rights reserved.</p>
                    <div className='flex items-center space-x-6'>
                        <a href="#" className='hover:text-gray-400 transition-colors'>Terms of Service</a>
                        <a href="#" className='hover:text-gray-400 transition-colors'>Privacy Policy</a>
                        <a href="#" className='hover:text-gray-400 transition-colors'>Cookie Settings</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer