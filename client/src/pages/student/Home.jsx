import React from 'react'
import Hero from '../../component/student/Hero'
import Companies from '../../component/student/Companies'
import CoursesSection from '../../component/student/CoursesSection'
import Testimonial from '../../component/student/Testimonial'
import CallToAction from '../../component/student/CallToAction'
import Footer from '../../component/student/Footer'

const Home = () => {
    return (
        <div className='flex flex-col items-center w-full'>
            <div className='max-w-7xl mx-auto px-5 md:px-10 lg:px-20 flex flex-col items-center pt-20 pb-20 gap-10 w-full'>
                <Hero />
                <Companies />
                <CoursesSection />
                <Testimonial />
                <CallToAction />
            </div>
            <Footer />
        </div>
    )
}

export default Home