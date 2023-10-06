import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import ROLES_LIST from '../ROLES_LIST'
import dashboardLogo from '../../assets/images/ppp-logo.png'
import { IoHomeOutline, IoPersonOutline, IoFolderOpenOutline, IoLogOutOutline, IoArchiveOutline } from 'react-icons/io5'
import { HiArchiveBox, HiOutlineArchiveBox, HiOutlineUserGroup } from 'react-icons/hi2'
import { FiUser, FiHome, FiUsers, FiLogOut, FiArchive } from 'react-icons/fi'
import { GrGroup } from 'react-icons/gr'
import './style.scss'
import UseLogout from '../../hooks/useLogout';
import { Box, Divider, Typography } from '@mui/material';
import { BsArchive, BsFillArchiveFill } from 'react-icons/bs';
import { Archive } from '@mui/icons-material';

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

                <Divider sx={{ ml: 1, width: '100%', mt: 2, mb: 2 }} />

                <NavLink to="archive" className={navOpen ? 'open' : ''}>
                    <HiOutlineArchiveBox size={26} />
                    <Typography component={'span'} className={navOpen ? 'active' : ''}>Archived</Typography>
                </NavLink>
            </nav>



        </div >
    );
}

export default Navbar;
