import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import ROLES_LIST from '../ROLES_LIST'
import dashboardLogo from '../../assets/images/ppp-logo.png'
import { IoHomeOutline, IoPersonOutline, IoFolderOpenOutline, IoLogOutOutline, IoArchiveOutline } from 'react-icons/io5'
import { HiArchiveBox, HiArrowDown, HiOutlineArchiveBox, HiOutlineUserGroup, HiOutlineUsers } from 'react-icons/hi2'
import { FiUser, FiHome, FiUsers, FiLogOut, FiArchive } from 'react-icons/fi'
import { GrGroup } from 'react-icons/gr'
import './style.scss'
import UseLogout from '../../hooks/useLogout';
import { Avatar, Box, Button, Divider, Fade, Grow, Hidden, Slide, Typography } from '@mui/material';
import { BsArchive, BsFillArchiveFill } from 'react-icons/bs';
import { Archive } from '@mui/icons-material';
import { SiGoogleclassroom } from "react-icons/si";
import useData from '../../hooks/useData';
import UserAvatar from '../UserAvatar';
import ClassAvatar from '../ClassAvatar';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { IoMdArrowDropdown, IoMdArrowDropright } from "react-icons/io";
import { FaChalkboardTeacher } from "react-icons/fa";


const Navbar = ({ setOpenDialog, navOpen }) => {
    const axiosPrivate = useAxiosPrivate()
    const { classes, setClasses, setCurrentSection } = useData()
    const { auth } = useAuth();
    const [classesShow, setClassesShow] = useState(false)
    const isAdmin = Boolean(auth?.roles?.find(role => role === ROLES_LIST.Admin))

    useEffect(() => {
        const getClasses = async () => {
            try {
                const response = await axiosPrivate.get('/class');

                setClasses(response.data.filter(item => item.archive == false))
            } catch (err) {
                console.log(err);
            }
        }

        if (classes.length == 0) {
            getClasses()
        }

    }, [])

    const classNavElements = classes?.map((item, index) => {
        return (
            <NavLink key={index} to={`/classroom/${item._id}`} onClick={() => setCurrentSection(item.section)}>
                <ClassAvatar
                    fullname={item.section}
                    variant="circular"
                    height={32}
                    width={32}
                    fontSize={'small'}
                />
                <Typography component={'span'} className={navOpen ? 'active' : ''}>{item.section}</Typography>
            </NavLink>
        )
    })

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
                    <NavLink to="classroom" className={navOpen ? 'open' : ''}>
                        <SiGoogleclassroom size={26} />
                        <Typography component={'span'} className={navOpen ? 'active' : ''}>Classroom</Typography>
                    </NavLink>
                }

                {classes.length > 0 &&

                    <>
                        <Divider sx={{ ml: 1, width: '100%', mt: 1, mb: 1 }} />

                        <a className={navOpen ? 'open' : ''} onClick={() => setClassesShow(v => !v)} style={{ userSelect: 'none', cursor: 'pointer' }}>
                            {classesShow ? <IoMdArrowDropright /> : <IoMdArrowDropdown />}
                            <FaChalkboardTeacher size={24} />
                            <Typography component={'span'} className={navOpen ? 'active' : ''}>Classes</Typography>
                        </a>

                        <Fade in={true} hidden={classesShow}>
                            <Box>
                                {classNavElements}
                            </Box>
                        </Fade>
                    </>

                }

                <Divider sx={{ ml: 1, width: '100%', mt: 1, mb: 1 }} />

                <NavLink to={isAdmin ? "user-archive" : "archive"} className={navOpen ? 'open' : ''}>
                    <HiOutlineArchiveBox size={26} />
                    <Typography component={'span'} className={navOpen ? 'active' : ''}>Archived</Typography>
                </NavLink>
            </nav>



        </div >
    );
}

export default Navbar;
