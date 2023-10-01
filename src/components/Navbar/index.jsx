import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import ROLES_LIST from '../ROLES_LIST'
import dashboardLogo from '../../assets/images/ppp-logo.png'
import { IoHomeOutline, IoPersonOutline, IoFolderOpenOutline, IoLogOutOutline } from 'react-icons/io5'
import { HiOutlineUserGroup } from 'react-icons/hi2'
import { FiUser, FiHome, FiUsers, FiLogOut } from 'react-icons/fi'
import { GrGroup } from 'react-icons/gr'
import './style.scss'
import UseLogout from '../../hooks/useLogout';
import { Box, Typography } from '@mui/material';

const Navbar = ({ setOpenDialog, navOpen }) => {
    const { auth } = useAuth();
    const isAdmin = Boolean(auth?.roles?.find(role => role === ROLES_LIST.Admin))

    return (
        <div className='navbar'>
            <nav className='navbar-nav'>
                <NavLink to="/" className={navOpen ? 'open' : ''}>
                    {
                        isAdmin ?
                            <>
                                <FiUsers size={24} />
                                <Typography component={'span'} className={navOpen ? 'active' : ''}>Users</Typography>
                            </> :
                            <>
                                <FiHome size={24} />
                                <Typography component={'span'} className={navOpen ? 'active' : ''}>Overview</Typography>
                            </>
                    }
                </NavLink>


                {!isAdmin
                    &&
                    <NavLink to="lessons" className={navOpen ? 'open' : ''}>
                        <IoFolderOpenOutline size={24} />
                        <Typography component={'span'} className={navOpen ? 'active' : ''}>Lessons</Typography>
                    </NavLink>
                }

                {!isAdmin
                    &&
                    <NavLink to="students" className={navOpen ? 'open' : ''}>
                        <HiOutlineUserGroup size={26} />
                        <Typography component={'span'} className={navOpen ? 'active' : ''}>Students</Typography>
                    </NavLink>
                }
            </nav>


        </div >
    );
}

export default Navbar;
