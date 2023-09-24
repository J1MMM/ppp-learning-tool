import React, { useEffect, useState } from 'react';
import { NavLink, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import './style.scss'
import Navbar from '../Navbar';
import { BsChevronDown } from 'react-icons/bs'
import useAuth from '../../hooks/useAuth';
import { Avatar, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Typography } from '@mui/material';
import { AccountCircle, ArrowBackIosNewSharp, ArrowCircleDownSharp, ArrowDownward, ArrowDownwardSharp, ArrowDropDown, CloseRounded, ContentCut, KeyboardArrowDown, Logout, MenuBookOutlined, MenuOutlined, MenuRounded, MiscellaneousServicesOutlined, PersonAdd, VisibilityOff } from '@mui/icons-material';
import { FiHome, FiLogOut, FiUser, FiUsers } from 'react-icons/fi';
import { HiOutlineUserGroup, HiUser, HiUsers } from 'react-icons/hi2';
import { GrUserAdd } from 'react-icons/gr';
import UseLogout from '../../hooks/useLogout';
import ROLES_LIST from '../ROLES_LIST';
import UserAvatar from '../UserAvatar';
import { IoFolderOpenOutline } from 'react-icons/io5';

const Layout = () => {
    const { auth } = useAuth()

    const [openDialog, setOpenDialog] = useState(false);
    const [headerShadow, setHeaderShadow] = useState(false);
    const fullname = auth?.fullname || undefined;
    const email = auth?.email || undefined;
    // menu 
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const navigate = useNavigate();
    const logout = UseLogout();

    const isAdmin = Boolean(auth?.roles?.find(role => role === ROLES_LIST.Admin))

    const signout = async () => {
        await logout()
        navigate('/login', { replace: true });
    }

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };



    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setHeaderShadow(true)
            } else {
                setHeaderShadow(false)
            }
        }
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll)
    })

    if (!auth?.fullname) {
        return <Navigate to='/login' />
    }

    return (
        <div className='layout'>
            <div className="navbar-container">
                <Navbar openDialog={openDialog} setOpenDialog={setOpenDialog} />
            </div>

            <section className='main-container'>
                <div className={headerShadow ? "header shadow" : "header"}>
                    <Box>
                        <Typography variant='h5' lineHeight='2rem' fontWeight='600' mb='-5px' color={'InfoText'} >Dashboard</Typography>
                        <Typography variant='caption' color={'InactiveCaptionText'} >Welcome back, {auth.fullname.split(' ')[0]}</Typography>
                    </Box>

                    <IconButton onClick={handleClick} sx={{
                        display: {
                            md: "none",
                        }
                    }}>
                        {anchorEl ?
                            <CloseRounded fontSize='large' color='action' /> :
                            <MenuRounded fontSize='large' color='action' />
                        }
                    </IconButton>

                    <Box
                        alignItems="center"
                        sx={{
                            display: {
                                xs: "none",
                                sm: "none",
                                md: "flex"
                            }
                        }}
                    >
                        {
                            fullname &&
                            <IconButton onClick={handleClick} sx={{ borderRadius: 1 }} >
                                <UserAvatar
                                    fullname={auth.fullname}
                                    variant="rounded"
                                />
                            </IconButton>
                        }
                        <Box>
                            <Typography variant='body1' mb={-1} fontWeight={600}>{fullname}</Typography>
                            <Typography variant='caption' color={'grey'}>{email}</Typography>
                        </Box>
                    </Box>
                </div>
                <main className='main'>
                    <Outlet />
                </main>
            </section >

            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title" variant='h6' fontWeight="500">
                    Confirm Sign out
                </DialogTitle>
                <Divider />
                <DialogContent >
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to sign out?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button size='small' onClick={() => setOpenDialog(false)} sx={{ color: 'InactiveCaptionText' }}>Cancel</Button>
                    <Button size='small' onClick={signout} color='error'>
                        Sign out
                    </Button>
                </DialogActions>
            </Dialog>

            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}

            >
                <Box
                    minWidth="250px"
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    // border="1px solid red"
                    pt={5}
                    sx={{
                        mb: {
                            xs: 1,
                            sm: 1,
                            md: 5
                        }
                    }}
                >
                    <Box bgcolor="primary.main" width="100%" height="100px" position="absolute" zIndex="1" top="-8px" left="0" />

                    <UserAvatar
                        fullname={auth.fullname}
                        height="70px"
                        width="70px"
                        border="3px solid #FFF"
                        fontSize="2rem"
                    />
                    <Typography zIndex="2" variant='h6' mt={1}>{fullname}</Typography>
                    <Typography zIndex="2" variant='caption' >{email}</Typography>

                    <Box mt={2} display="flex" alignItems="center" gap={1}>
                        {auth.roles.map((role, index) => {
                            if (role === 0) return;
                            return role && <Chip key={index} label={Object.keys(ROLES_LIST).find(key => ROLES_LIST[key] == role)} color='primary' size='small' />
                        })}
                    </Box>
                </Box>

                <nav style={{ display: "none" }} className='menu-nav'>
                    <NavLink to="/" onClick={() => setAnchorEl(false)}>
                        <FiHome size={22} />
                        <span>Overview</span>
                    </NavLink>
                    {!isAdmin
                        &&
                        <NavLink to="lessons" onClick={() => setAnchorEl(false)}>
                            <IoFolderOpenOutline size={22} />
                            <span>Lessons</span>
                        </NavLink>
                    }
                    {!isAdmin
                        &&
                        <NavLink to="students" onClick={() => setAnchorEl(false)}>
                            <HiOutlineUserGroup size={26} />
                            <span>Students</span>
                        </NavLink>
                    }
                    {/* {isAdmin
                        &&
                        <NavLink to="users" onClick={() => setAnchorEl(false)}>
                            <FiUsers size={22} />
                            <span>Users List</span>
                        </NavLink>
                    } */}
                </nav>

                <button style={{ display: 'none' }} className='sign-out-btn menu-logout-btn' onClick={() => setOpenDialog(true)}>
                    <FiLogOut size={22} />
                    <span>Sign out</span>
                </button>

                <MenuItem sx={{
                    p: 1,
                    display: {
                        xs: "none",
                        sm: "none",
                        md: "flex",
                    }
                }} onClick={() => setOpenDialog(true)}>
                    <ListItemIcon sx={{ ml: 7 }}>
                        <Logout />
                    </ListItemIcon>
                    <Typography>Sign out </Typography>
                </MenuItem>

            </Menu>
        </div >
    );
}

export default Layout;
