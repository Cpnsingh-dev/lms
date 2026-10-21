import React, { useContext, useEffect } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { AppContext } from '../../context/AppContext';

const Loading = ({ message }) => {
    const { path } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { backendUrl, fetchUserEnrolledCourses } = useContext(AppContext);

    useEffect(() => {
        let isMounted = true;
        const sessionId = searchParams.get('session_id');

        const handleVerificationAndNavigation = async () => {
            if (sessionId) {
                try {
                    const apiBase = backendUrl || 'http://localhost:5000';
                    await fetch(`${apiBase}/api/user/verify-purchase`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ sessionId })
                    });
                    if (fetchUserEnrolledCourses) {
                        await fetchUserEnrolledCourses();
                    }
                } catch (err) {
                    console.error('Failed to verify purchase session:', err);
                }
            }

            if (!isMounted) return;

            const targetPath = path === 'enrolled' || path === 'my-enrollments' ? '/my-enrollments' : `/${path || ''}`;
            const timer = setTimeout(() => {
                navigate(targetPath);
            }, sessionId ? 1500 : 3000);

            return () => clearTimeout(timer);
        };

        if (path) {
            handleVerificationAndNavigation();
        }

        return () => {
            isMounted = false;
        };
    }, [path, navigate, searchParams, backendUrl, fetchUserEnrolledCourses]);

    return (
        <div className='min-h-[75vh] flex flex-col items-center justify-center px-4'>
            {/* Spinner Container */}
            <div className='relative flex items-center justify-center'>
                {/* Glow backdrop */}
                <div className='w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-blue-500/10 blur-xl animate-pulse'></div>

                {/* Background Ring */}
                <div className='absolute w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-gray-200'></div>

                {/* Animated Spinner Ring */}
                <div className='absolute w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-transparent border-t-blue-600 border-r-blue-500 animate-spin'></div>

                {/* Inner Accent Dot */}
                <div className='absolute w-2.5 h-2.5 sm:w-3 sm:h-3 bg-blue-600 rounded-full animate-ping opacity-75'></div>
            </div>

            {/* Loading Text */}
            <div className='mt-8 text-center'>
                <h3 className='text-base sm:text-lg font-semibold text-gray-800 tracking-wide flex items-center justify-center gap-1.5'>
                    <span>Loading</span>
                    <span className='inline-flex text-blue-600'>
                        <span className='animate-bounce [animation-delay:-0.3s]'>.</span>
                        <span className='animate-bounce [animation-delay:-0.15s]'>.</span>
                        <span className='animate-bounce'>.</span>
                    </span>
                </h3>
                <p className='text-xs sm:text-sm text-gray-500 mt-1 max-w-xs'>
                    {path
                        ? 'Redirecting to your destination, please wait...'
                        : message || 'Please wait while we prepare your content...'}
                </p>
            </div>
        </div>
    )
}

export default Loading