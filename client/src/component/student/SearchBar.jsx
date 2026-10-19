import React, { useState } from 'react'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'
const SearchBar = ({ data }) => {

    const [input, setInput] = useState(data ? data : "")
    const navigate = useNavigate()
    const handleSubmit = (e) => {
        e.preventDefault()
        if (input.trim()) {
            navigate(`/course-list/${input}`)
        }
        else {
            navigate(`/course-list`)
        }
    }
    return (
        <form onSubmit={handleSubmit} className='max-w-xl w-full md:h-14 h-12 flex items-center bg-white border border-gray-500/20 rounded'>
            <img src={assets.search_icon} alt="search" className='md:w-auto w-10 px-3' />
            <input type="text" placeholder='Search Course' className='w-full h-full outline-none text-gray-500/80' value={input} onChange={(e) => setInput(e.target.value)} />
            <button type='submit' className='bg-blue-600 rounded text-white md:px-10 px-7 md:py-3 py-2 mx-1 hover:bg-blue-700 transition'>Search</button>
        </form>
    )
}

export default SearchBar