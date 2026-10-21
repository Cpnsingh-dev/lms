import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../../context/AppContext';
import Loading from '../../component/student/Loading';
import { assets } from '../../assets/assets';
import humanizeDuration from 'humanize-duration';
import Footer from '../../component/student/Footer';
import YouTube from 'react-youtube';

const CourseDetails = () => {

    const { id } = useParams();

    const [courseData, setCourseData] = useState(null);
    const [openChapter, setOpenChapter] = useState({});
    const [isOpenrolled, setIsEnrolled] = useState(false);
    const [playerData, setPlayerData] = useState(null);

    const { allCourses, currency, calculateRating, courseDuration, totalLecture, calculateChapterTime } = useContext(AppContext);

    const fetchCourseData = async () => {
        const findCourse = allCourses.find(course => course._id === id);
        setCourseData(findCourse);
    }

    //toggkle
    const toggleChapter = (index) => {
        setOpenChapter(prev => {
            const isOpen = !!prev[index];
            return {
                ...prev,
                [index]: !isOpen
            }
        })
    }

    useEffect(() => {
        fetchCourseData();
    }, [allCourses, id])

    const avgRating = courseData ? calculateRating(courseData) : 0;
    const ratingsCount = courseData?.courseRatings?.length || 0;

    return courseData ? (
        <>
            <div className='flex md:flex-row flex-col-reverse gap-10 relative items-start justify-between md:px-36 px-8 md:pt-30 pt-20 text-left'>

                <div className='absolute top-0 left-0 w-full h-section-height -z-1 bg-gradient-to-b from-cyan-100/70 via-white to-blue-50'></div>

                {/* left column  */}
                <div className='max-w-xl z-10 text-gray-500'>
                    <h1 className='md:text-4xl text-2xl font-semibold text-gray-800'>{courseData?.courseTitle}</h1>
                    <p className='pt-4 md:text-base text-sm' dangerouslySetInnerHTML={{ __html: courseData?.courseDescription.slice(0, 201) }}></p>
                    {/* review and rating */}
                    <div className='flex items-center space-x-2 pt-3 pb-1 text-sm'>
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
                    <p className='text-sm pt-2'>Course by <span className='text-blue-600 underline'>Chandra pratap</span></p>
                    <div className='pt-8 text-gray-800'>
                        <h2 className='text-xl font-semibold'>Course Structure</h2>
                        <div className='pt-5'>
                            {courseData?.courseContent?.map((chapter, idx) => (
                                <div key={idx} className='border border-gray-300 bg-white mb-2 rounded'>
                                    <div className='flex items-center justify-between px-4 py-3 cursor-pointer select-none' onClick={() => toggleChapter(idx)}>
                                        <div className='flex items-center gap-2'>
                                            <img className={`transform transition-transform ${openChapter[idx] ? 'rotate-180' : ''}`} src={assets.down_arrow_icon} alt="down-arrow" />
                                            <p className='font-medium md:text-base text-sm'>{chapter.chapterTitle}</p>
                                        </div>
                                        <p className='text-sm md:text-default'>{chapter.chapterContent.length} lectures - {calculateChapterTime(chapter)}</p>
                                    </div>
                                    <div className={`overflow-hidden transition-all duration-300 ${openChapter[idx] ? 'max-h-96' : 'max-h-0'}`}>
                                        <ul className='list-disc md:pl-10 pl-4 pr-4 py-2 text-gray-600 border-t border-gray-300'>
                                            {chapter.chapterContent.map((lecture, idx) => (
                                                <li key={idx} className='flex items-start gap-2 py-1'>
                                                    <img src={assets.play_icon} alt="play" className='w-4 h-4 mt-1' />
                                                    <div className='flex items-center justify-between w-full text-gray-800 text-xs md:text-default'>
                                                        <p>{lecture.lectureTitle}</p>
                                                        <div className='flex gap-2'>
                                                            {lecture.isPreviewFree && (
                                                                <p
                                                                    onClick={() => {
                                                                        const videoId = lecture.lectureUrl.split('/').pop();
                                                                        if (playerData?.videoId === videoId) {
                                                                            setPlayerData(null);
                                                                        } else {
                                                                            setPlayerData({ videoId });
                                                                            if (window.innerWidth < 768) {
                                                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                                                            }
                                                                        }
                                                                    }}
                                                                    className={`cursor-pointer font-medium ${playerData?.videoId === lecture.lectureUrl.split('/').pop() ? 'text-red-500' : 'text-blue-600'}`}
                                                                >
                                                                    {playerData?.videoId === lecture.lectureUrl.split('/').pop() ? 'Stop' : 'Preview'}
                                                                </p>
                                                            )}
                                                            <p>{humanizeDuration(lecture.lectureDuration * 60 * 1000,
                                                                { units: ["m", "s"] }
                                                            )}</p>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className='py-20 text-sm md:text-default'>
                        <h3 className='text-xl font-semibold text-gray-800'>Course Description</h3>
                        <div className='pt-3 rich-text text-sm' dangerouslySetInnerHTML={{ __html: courseData?.courseDescription }}></div>
                    </div>
                </div>

                {/* right section */}
                <div className='max-w-[420px] z-10 shadow-lg rounded-t md:rounded-lg overflow-hidden bg-white min-w-[300px] sm:min-w-[400px]'>
                    {
                        playerData ? (
                            <div className='relative'>
                                <YouTube videoId={playerData.videoId} opts={{ playerVars: { autoplay: 1 } }} iframeClassName='w-full aspect-video' />
                                <button
                                    onClick={() => setPlayerData(null)}
                                    className='absolute top-2 right-2 bg-white/90 hover:bg-white p-2 rounded-full z-20 cursor-pointer shadow-md transition'
                                    title='Stop video'
                                >
                                    <img src={assets.cross_icon} alt="close" className='w-3 h-3' />
                                </button>
                            </div>
                        ) : (
                            <img src={courseData.courseThumbnail} alt={courseData.courseTitle} className='w-full object-cover' />
                        )
                    }
                    <div className='p-5'>
                        <div className='flex items-center gap-2 pt-2 text-red-500'>
                            <img className='w-4' src={assets.time_left_clock_icon} alt="time left" />
                            <p className='text-sm text-red-500'><span className='font-medium'>5 days</span> at this price!</p>
                        </div>
                        <div className='flex items-center gap-3 pt-2'>
                            <p className='text-gray-800 md:text-4xl text-2xl font-semibold'>{currency} {(courseData.coursePrice - courseData.discount * courseData.coursePrice / 100).toFixed(2)}</p>

                            <p className='md:text-lg text-gray-500 line-through'>{currency} {courseData.coursePrice}</p>

                            <p className='md:text-lg text-red-500'>{courseData.discount} % off</p>

                        </div>

                        <div className='flex items-center text-sm md:text-default gap-4 pt-2 md:pt-4 text-gray-500'>
                            <div className='flex items-center gap-1'>
                                <img src={assets.star} alt="star-icon" />
                                <p>({calculateRating(courseData)}) {courseData.courseRatings.length} ratings</p>
                            </div>
                            <div className='h-4 w-px bg-gray-500/40'></div>

                            <div className='flex items-center gap-1'>
                                <img src={assets.time_clock_icon} alt="time-icon" />
                                <p>{courseDuration(courseData)}</p>
                            </div>

                            <div className='h-4 w-px bg-gray-500/40'></div>

                            <div className='flex items-center gap-1'>
                                <img src={assets.lesson_icon} alt="video-icon" />
                                <p>{totalLecture(courseData)} lectures</p>
                            </div>
                        </div>

                        <button className='md:mt-6 mt-4 w-full py-3 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 transition cursor-pointer'>
                            {isOpenrolled ? 'Go to Course' : 'Buy Now'}
                        </button>

                        <div className='pt-6'>
                            <p className='md:text-xl text-lg font-medium text-gray-800'>What's in the Course</p>
                            <ul className='ml-4 pt-2 text-sm md:text-default list-disc text-gray-500 space-y-1'>
                                <li>LifeTime access with free updates</li>
                                <li>Access on mobile and desktop</li>
                                <li>Certificate upon completion</li>
                                <li>Money back guarantee</li>
                                <li>Quizzes to test your knowledge</li>
                            </ul>
                        </div>
                    </div>
                </div>

            </div>
            <Footer />
        </>
    ) : <Loading />
}

export default CourseDetails