import React from 'react'
import { FaRegKeyboard } from "react-icons/fa6";
import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <div className=' bg-[#000814] ' >
      <nav className=' flex justify-between ' >

        <div className='m-1 flex  ' >
          <NavLink to="/" className='flex ' >
              <FaRegKeyboard className='w-10 h-10 mr-1.5 text-[#8499b9] ml-2 ' />
              <h1 className='text-white text-2xl font-medium font-serif tracking-wider m-1 ml-2 ' >Type Racer </h1>
          </NavLink>

          
        </div>

      </nav>


    </div>
  )
}
