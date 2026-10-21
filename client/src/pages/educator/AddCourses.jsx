import React, { useEffect, useRef, useState } from 'react'
import uniqid from 'uniqid';
import Quill from 'quill'
import 'quill/dist/quill.snow.css';
import { assets } from '../../assets/assets';

const AddCourses = () => {

    const quillRef = useRef(null);
    const editorRef = useRef(null);

    const [courseTitle, setCourseTitle] = useState('')
    const [discountPrice, setDiscountPrice] = useState(0)
    const [price, setPrice] = useState(0)
    const [image, setImage] = useState(null)
    const [chapters, setChapters] = useState([])
    const [showPopup, setShowPopup] = useState(false);
    const [currentChapterId, setCurrentChapterId] = useState(null);
    const [lectureDetails, setLectureDetails] = useState({
        lectureTitle: "",
        lectureDuration: "",
        lectureUrl: "",
        isPreviewFree: false
    });

    const handleChapter = (action, chapterId) => {
        if (action === 'add') {
            const title = prompt("Enter Chapter Title: ");
            if (title) {
                const newChapter = {
                    chapterId: uniqid(),
                    chapterTitle: title,
                    chapterContent: [],
                    collapsed: false,
                    chapterOrder: chapters.length > 0 ? chapters.slice(-1)[0].chapterOrder + 1 : 1
                }
                setChapters([...chapters, newChapter])
            }
        } else if (action === 'remove') {
            setChapters(chapters.filter(chapter => chapter.chapterId !== chapterId))
        } else if (action === 'toggle') {
            setChapters(
                chapters.map((chapter) =>
                    chapter.chapterId === chapterId ? { ...chapter, collapsed: !chapter.collapsed } : chapter
                )
            )
        }
    }

    const handleLecture = (action, chapterId, lIdx) => {
        if (action === 'add') {
            setCurrentChapterId(chapterId)
            setShowPopup(true)
        } else if (action === 'remove') {
            setChapters(chapters.map((chapter) => {
                if (chapter.chapterId === chapterId) {
                    chapter.chapterContent.splice(lIdx, 1)
                }
                return chapter;
            }))
        }
    }

    const addLecture = () => {
        if (!lectureDetails.lectureTitle || !lectureDetails.lectureDuration || !lectureDetails.lectureUrl) {
            alert("Please fill all the lecture details")
            return
        }
        setChapters(chapters.map((chapter) => {
            if (chapter.chapterId === currentChapterId) {
                chapter.chapterContent.push(lectureDetails)
            }
            return chapter;
        }))
        setLectureDetails({ lectureTitle: "", lectureDuration: "", lectureUrl: "", isPreviewFree: false })
        setShowPopup(false)
        setCurrentChapterId(null)
    }


    const handleSubmit = async (e) => {
        e.preventDefault();

    }

    useEffect(() => {
        if (!editorRef.current) return;

        // Clean up any previously attached toolbar from prior renders / hot-reloads
        const existingToolbar = editorRef.current.parentElement?.querySelector('.ql-toolbar');
        if (existingToolbar) {
            existingToolbar.remove();
        }
        editorRef.current.innerHTML = '';

        quillRef.current = new Quill(editorRef.current, {
            theme: 'snow',
            modules: {
                toolbar: [
                    [{ header: [1, 2, 3, 4, 5, 6, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    ['blockquote', 'code-block'],
                    [{ color: [] }, { background: [] }],
                    [{ align: [] }],
                    ['link', 'clean']
                ]
            }
        });

        return () => {
            if (quillRef.current) {
                const toolbarModule = quillRef.current.getModule('toolbar');
                if (toolbarModule && toolbarModule.container) {
                    toolbarModule.container.remove();
                }
                quillRef.current = null;
            }
        };
    }, []);

    return (
        <div className='min-h-screen flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0'>
            <form onClick={handleSubmit} className='flex flex-col gap-5 max-w-2xl w-full text-gray-700'>
                <div className='flex flex-col gap-1'>
                    <p className='font-medium text-gray-800'>Course Title</p>
                    <input
                        type="text"
                        placeholder='Type here'
                        className='outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 w-full'
                        onChange={e => setCourseTitle(e.target.value)}
                        value={courseTitle}
                        required
                    />
                </div>
                <div className='flex flex-col gap-1'>
                    <p className='font-medium text-gray-800'>Course Description</p>
                    <div ref={editorRef} className='bg-white'></div>
                </div>

                <div className='flex items-center justify-between flex-wrap gap-4'>

                    <div className='flex flex-col gap-1'>
                        <p className='font-medium text-gray-800'>Course Price</p>
                        <input
                            type="number"
                            onChange={e => setPrice(e.target.value)}
                            placeholder='0'
                            value={price}
                            className='outline-none md:py-2.5 py-2 w-28 px-3 rounded border border-gray-500/40'
                            required
                        />
                    </div>

                    <div className='flex md:flex-row flex-col items-center gap-3'>
                        <p className='font-medium text-gray-800'>Course Thumbnail</p>
                        <label htmlFor="thumbnailImage" className='flex items-center gap-3 cursor-pointer'>
                            <img src={assets.file_upload_icon} alt="" className='p-3 bg-blue-500 rounded' />
                            <input type="file" id='thumbnailImage' accept='image/*' onChange={e => setImage(e.target.files[0])} hidden />
                            <img className='max-h-10' src={image ? URL.createObjectURL(image) : ""} alt="" />
                        </label>
                    </div>
                </div>
                <div className='flex flex-col gap-1'>
                    <p className='font-medium text-gray-800'>Discount %</p>
                    <input type="number" onChange={e => setDiscountPrice(e.target.value)} value={discountPrice} placeholder='0' className='outline-none md:py-2.5 py-2 w-28 px-3 rounded border border-gray-500/40' />
                </div>

                {/* Adding chapters and lectures */}
                <div className='mt-4'>
                    {chapters.map((c, idx) => (
                        <div key={idx} className='bg-white border rounded-lg mb-4'>
                            <div className='flex justify-between items-center p-4 border-b'>
                                <div className='flex items-center'>
                                    <img
                                        onClick={() => handleChapter('toggle', c.chapterId)}
                                        src={assets.dropdown_icon}
                                        width={14}
                                        alt=""
                                        className={`mr-2 cursor-pointer transition-all ${c.collapsed && "-rotate-90"}`}
                                    />
                                    <span className='font-semibold'>{idx + 1} {c.chapterTitle}</span>
                                </div>
                                <span className='text-gray-500'>{c.chapterContent.length} lectures</span>
                                <img onClick={() => handleChapter('remove', c.chapterId)} src={assets.cross_icon} alt="" className='cursor-pointer' />
                            </div>
                            {!c.collapsed && (
                                <div className='p-4'>
                                    {c.chapterContent.map((l, i) => (
                                        <div key={i} className='flex justify-between items-center mb-2'>
                                            <span>
                                                {i + 1} {l.lectureTitle} - {l.lectureDuration} mins - <a href={l.lectureUrl} target='_blank' rel='noreferrer' className='text-blue-500'>Link</a> - {l.isPreviewFree ? "Free" : "Paid"}
                                            </span>
                                            <img onClick={() => handleLecture('remove', c.chapterId, i)} src={assets.cross_icon} alt="" className='cursor-pointer' />
                                        </div>
                                    ))}
                                    <div onClick={() => handleLecture('add', c.chapterId)} className='inline-flex bg-gray-100 p-2 rounded cursor-pointer mt-2 text-sm'>
                                        + Add Lecture
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    <div className='flex justify-center items-center bg-blue-100 p-2 rounded-lg cursor-pointer' onClick={() => handleChapter('add')}>+ Add Chapter</div>
                    {
                        showPopup && (
                            <div className='fixed inset-0 flex items-center justify-center bg-gray-800/50 z-50'>
                                <div className='bg-white text-gray-700 p-4 sm:p-6 rounded relative w-full max-w-80 sm:max-w-96'>
                                    <h2 className='text-lg font-semibold mb-4 text-gray-800'>Add Lecture</h2>
                                    <div className='mb-2'>
                                        <p className='font-medium text-gray-800'>Lecture Title</p>
                                        <input
                                            type="text"
                                            className='mt-1 block w-full border rounded py-1 px-2 border-gray-300 outline-none'
                                            value={lectureDetails.lectureTitle}
                                            onChange={(e) => setLectureDetails({ ...lectureDetails, lectureTitle: e.target.value })}
                                        />
                                    </div>
                                    <div className='mb-2'>
                                        <p className='font-medium text-gray-800'>Lecture Duration (mins)</p>
                                        <input
                                            type="number"
                                            className='mt-1 block w-full border rounded py-1 px-2 border-gray-300 outline-none'
                                            value={lectureDetails.lectureDuration}
                                            onChange={(e) => setLectureDetails({ ...lectureDetails, lectureDuration: e.target.value })}
                                        />
                                    </div>
                                    <div className='mb-2'>
                                        <p className='font-medium text-gray-800'>Lecture Url</p>
                                        <input
                                            type="text"
                                            className='mt-1 block w-full border rounded py-1 px-2 border-gray-300 outline-none'
                                            value={lectureDetails.lectureUrl}
                                            onChange={(e) => setLectureDetails({ ...lectureDetails, lectureUrl: e.target.value })}
                                        />
                                    </div>
                                    <div className='flex gap-2 my-4 items-center'>
                                        <input
                                            type="checkbox"
                                            id="isPreviewFree"
                                            className='scale-125 cursor-pointer'
                                            checked={lectureDetails.isPreviewFree}
                                            onChange={(e) => setLectureDetails({ ...lectureDetails, isPreviewFree: e.target.checked })}
                                        />
                                        <label htmlFor="isPreviewFree" className='cursor-pointer text-sm font-medium text-gray-700'>Is Preview Free</label>
                                    </div>
                                    <button onClick={addLecture} type='button' className='w-full bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded font-medium cursor-pointer transition'>Add</button>
                                    <img onClick={() => setShowPopup(false)} src={assets.cross_icon} alt="" className='absolute top-4 right-4 w-4 cursor-pointer' />
                                </div>
                            </div>
                        )
                    }
                </div>
                <button type='submit' className='bg-black text-white w-max py-2.5 px-8 rounded my-4 cursor-pointer hover:bg-gray-800 transition'>ADD</button>
            </form>
        </div>
    )
}

export default AddCourses