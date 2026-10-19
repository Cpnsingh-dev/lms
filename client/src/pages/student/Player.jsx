import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'
import humanizeDuration from 'humanize-duration'
import YouTube from 'react-youtube'
import Rating from '../../component/student/Rating'
import Footer from '../../component/student/Footer'
import Loading from '../../component/student/Loading'

const Player = () => {
    const { courseId } = useParams();
    const { enrolledCourses, allCourses, calculateChapterTime } = useContext(AppContext);

    const [courseData, setCourseData] = useState(null);
    const [openChapter, setOpenChapter] = useState({});
    const [playerData, setPlayerData] = useState(null);
    const [completedLectures, setCompletedLectures] = useState([]);
    const [initialRating, setInitialRating] = useState(0);

    // Fetch course data from enrolledCourses or allCourses
    const fetchCourseData = () => {
        const course = (enrolledCourses?.length > 0
            ? enrolledCourses.find(c => c._id === courseId)
            : null) || allCourses.find(c => c._id === courseId);

        if (course) {
            setCourseData(course);
        }
    };

    // Extract video ID from any YouTube URL format
    const getYouTubeVideoId = (url) => {
        if (!url) return '';
        try {
            if (url.includes('youtu.be/')) {
                return url.split('youtu.be/')[1].split('?')[0];
            }
            if (url.includes('watch?v=')) {
                return url.split('watch?v=')[1].split('&')[0];
            }
            return url.split('/').pop().split('?')[0];
        } catch {
            return url.split('/').pop() || '';
        }
    };

    // Toggle chapter accordion
    const toggleChapter = (index) => {
        setOpenChapter(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    // Toggle lecture selection (start/stop)
    const handleLectureClick = (lecture, chapterIdx, lectureIdx) => {
        if (playerData?.lectureId === lecture.lectureId) {
            // Stop and close the video if already playing
            setPlayerData(null);
        } else {
            setPlayerData({
                ...lecture,
                chapter: chapterIdx + 1,
                lecture: lectureIdx + 1
            });
            // On mobile view, smoothly scroll up to the player
            if (window.innerWidth < 768) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    };

    // Toggle lecture completion status
    const toggleLectureCompleted = (lectureId) => {
        setCompletedLectures(prev =>
            prev.includes(lectureId)
                ? prev.filter(id => id !== lectureId)
                : [...prev, lectureId]
        );
    };

    // Handle course rating
    const handleRating = (rating) => {
        setInitialRating(rating);
    };

    useEffect(() => {
        if (enrolledCourses.length > 0 || allCourses.length > 0) {
            fetchCourseData();
        }
    }, [enrolledCourses, allCourses, courseId]);

    // Open first chapter by default when course loads
    useEffect(() => {
        if (courseData && courseData.courseContent?.length > 0) {
            setOpenChapter(prev => ({ ...prev, 0: true }));
        }
    }, [courseData]);

    return courseData ? (
        <>
            <div className='p-4 sm:p-10 flex flex-col-reverse md:grid md:grid-cols-2 gap-10 md:px-36 min-h-[calc(100vh-200px)]'>
                {/* left part */}
                <div className='text-gray-800'>
                    <h2 className='text-xl font-semibold'>Course Structure</h2>

                    <div className='pt-5'>
                        {courseData.courseContent?.map((chapter, chapterIdx) => (
                            <div key={chapterIdx} className='border border-gray-300 bg-white mb-2 rounded'>
                                <div
                                    className='flex items-center justify-between px-4 py-3 cursor-pointer select-none'
                                    onClick={() => toggleChapter(chapterIdx)}
                                >
                                    <div className='flex items-center gap-2'>
                                        <img
                                            className={`transform transition-transform ${openChapter[chapterIdx] ? 'rotate-180' : ''}`}
                                            src={assets.down_arrow_icon}
                                            alt="down-arrow"
                                        />
                                        <p className='font-medium md:text-base text-sm'>{chapter.chapterTitle}</p>
                                    </div>
                                    <p className='text-sm md:text-default'>
                                        {chapter.chapterContent.length} lectures - {calculateChapterTime(chapter)}
                                    </p>
                                </div>

                                <div className={`overflow-hidden transition-all duration-300 ${openChapter[chapterIdx] ? 'max-h-96' : 'max-h-0'}`}>
                                    <ul className='list-disc md:pl-10 pl-4 pr-4 py-2 text-gray-600 border-t border-gray-300'>
                                        {chapter.chapterContent.map((lecture, lectureIdx) => {
                                            const isSelected = playerData?.lectureId === lecture.lectureId;
                                            const isDone = completedLectures.includes(lecture.lectureId);

                                            return (
                                                <li
                                                    key={lectureIdx}
                                                    onClick={() => handleLectureClick(lecture, chapterIdx, lectureIdx)}
                                                    className={`flex items-start gap-2 py-2 px-2 rounded cursor-pointer transition ${isSelected ? 'bg-blue-50 font-medium text-blue-600' : 'hover:bg-gray-50 text-gray-800'
                                                        }`}
                                                >
                                                    <img
                                                        src={isDone ? assets.blue_tick_icon : assets.play_icon}
                                                        alt="status"
                                                        className='w-4 h-4 mt-1 flex-shrink-0'
                                                    />
                                                    <div className='flex items-center justify-between w-full text-xs md:text-default'>
                                                        <p className={`${isSelected ? 'text-blue-600 font-semibold' : 'text-gray-800'}`}>
                                                            {lecture.lectureTitle}
                                                        </p>
                                                        <div className='flex items-center gap-3'>
                                                            {lecture.lectureUrl && (
                                                                <p
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleLectureClick(lecture, chapterIdx, lectureIdx);
                                                                    }}
                                                                    className={`cursor-pointer font-medium text-xs ${isSelected ? 'text-red-500' : 'text-blue-600'}`}
                                                                >
                                                                    {isSelected ? 'Stop' : 'Watch'}
                                                                </p>
                                                            )}
                                                            <p className='text-gray-500 text-xs'>
                                                                {humanizeDuration(lecture.lectureDuration * 60 * 1000, { units: ["m", "s"] })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Rate Course */}
                    <div className='flex items-center gap-3 py-6 mt-6 border-t border-gray-200'>
                        <h3 className='text-xl font-bold text-gray-800'>Rate this Course:</h3>
                        <Rating initialRating={initialRating} onRate={handleRating} />
                    </div>
                </div>

                {/* right part */}
                <div className='md:mt-10'>
                    {playerData ? (
                        <div>
                            <div className='relative rounded-lg overflow-hidden shadow bg-black'>
                                <YouTube
                                    videoId={getYouTubeVideoId(playerData.lectureUrl)}
                                    iframeClassName='w-full aspect-video'
                                    opts={{ playerVars: { autoplay: 1 } }}
                                />
                                <button
                                    onClick={() => setPlayerData(null)}
                                    className='absolute top-2 right-2 bg-white/90 hover:bg-white p-2 rounded-full z-20 cursor-pointer shadow-md transition'
                                    title='Stop video'
                                >
                                    <img src={assets.cross_icon} alt="close" className='w-3.5 h-3.5' />
                                </button>
                            </div>

                            <div className='flex flex-wrap justify-between items-center mt-4 gap-3'>
                                <p className='text-lg md:text-xl font-semibold text-gray-800'>
                                    {playerData.chapter}.{playerData.lecture} {playerData.lectureTitle}
                                </p>
                                <div className='flex items-center gap-2'>
                                    <button
                                        onClick={() => setPlayerData(null)}
                                        className='text-sm font-medium px-3 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 transition cursor-pointer flex items-center gap-1'
                                        title='Stop video'
                                    >
                                        <img src={assets.cross_icon} alt="stop" className='w-2.5 h-2.5' />
                                        <span>Stop</span>
                                    </button>
                                    <button
                                        onClick={() => toggleLectureCompleted(playerData.lectureId)}
                                        className={`text-sm font-medium px-4 py-2 rounded transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${completedLectures.includes(playerData.lectureId)
                                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                            : 'bg-blue-600 text-white hover:bg-blue-700'
                                            }`}
                                    >
                                        {completedLectures.includes(playerData.lectureId) && (
                                            <img src={assets.blue_tick_icon} alt="tick" className='w-4 h-4' />
                                        )}
                                        {completedLectures.includes(playerData.lectureId) ? 'Completed' : 'Mark Complete'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className='rounded-lg overflow-hidden shadow bg-white border border-gray-200'>
                            <div
                                className='relative cursor-pointer group'
                                onClick={() => {
                                    const firstLecture = courseData.courseContent?.[0]?.chapterContent?.[0];
                                    if (firstLecture) {
                                        setPlayerData({
                                            ...firstLecture,
                                            chapter: 1,
                                            lecture: 1
                                        });
                                        if (window.innerWidth < 768) {
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }
                                    }
                                }}
                            >
                                <img
                                    src={courseData.courseThumbnail}
                                    alt={courseData.courseTitle}
                                    className='w-full aspect-video object-cover'
                                />
                                <div className='absolute inset-0 bg-black/25 flex items-center justify-center group-hover:bg-black/35 transition'>
                                    <div className='w-14 h-14 bg-white/95 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition'>
                                        <img src={assets.play_icon} alt="play" className='w-5 h-5 ml-1' />
                                    </div>
                                </div>
                            </div>
                            <div className='p-4'>
                                <h3 className='font-semibold text-gray-800 text-lg'>{courseData.courseTitle}</h3>
                                <p className='text-sm text-gray-500 mt-1'>Click above or select any lecture below to start watching.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    ) : <Loading />
}

export default Player