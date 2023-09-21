import React from 'react'
import { NavLink } from 'react-router-dom'
import './Navbar.css'

const Navbar = ({ searchQuery, handleSearchChange }) => {
    const navLink = [
        { name: 'Home', link: '/' },
        { name: 'Skaters', link: '/skaters' },
        { name: 'Goalies', link: '/goalies' },
        { name: 'Teams', link: '/teams' },
    ]

    return (
        <nav className="flex mx-auto px-5 h-10 w-9/12 bg-white">
            <div className="flex items-center h-full">
                {navLink.map(({ link, name }) => (
                    <NavLink
                        key={name}
                        to={link}
                        className="p-5 hover:cursor-pointer uppercase rounded-md"
                    >
                        {name}
                    </NavLink>
                ))}

                <input
                    type="text"
                    placeholder="Search By Player or Team..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="px-3 py-2 font-medium border border-gray-300 focus:border-red-100 ml-[40em]"
                />

                <div className="pl-[30em]"></div>
            </div>
        </nav>
    )
}

export default Navbar
