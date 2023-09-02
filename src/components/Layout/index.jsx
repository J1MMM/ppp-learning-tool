import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import './style.scss'
import Navbar from '../Navbar';
import { BsChevronDown } from 'react-icons/bs'
import useAuth from '../../hooks/useAuth';
import { Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Typography } from '@mui/material';
import { AccountCircle, ArrowBackIosNewSharp, ArrowCircleDownSharp, ArrowDownward, ArrowDownwardSharp, ArrowDropDown, ContentCut, KeyboardArrowDown, Logout, PersonAdd, VisibilityOff } from '@mui/icons-material';
import { FiUser } from 'react-icons/fi';
import { HiUser, HiUsers } from 'react-icons/hi2';
import { GrUserAdd } from 'react-icons/gr';
import UseLogout from '../../hooks/useLogout';
import ROLES_LIST from '../ROLES_LIST';
import UserAvatar from '../UserAvatar';

const Layout = () => {
    const { auth } = useAuth()

    const [openDialog, setOpenDialog] = useState(false);
    const fullname = auth?.fullname || undefined;
    const email = auth?.email || undefined;

    const navigate = useNavigate();
    const location = useLocation()
    const logout = UseLogout();

    const isAdmin = Boolean(auth?.roles?.find(role => role === ROLES_LIST.Admin))

    useEffect(() => {
        document.title = getPageTitle(location.pathname);
    }, [location.pathname]);

    const getPageTitle = (pathname) => {
        switch (pathname) {
            case '/':
                return 'Dashboard';
            case '/users':
                return 'Users Management';
            case '/students':
                return 'Students Management';
            case '/login':
                return 'Users Login';
            case '/lessons':
                return 'Lessons Management';
            // Add more cases for other routes
            default:
                return 'PPPedu';
        }
    };

    const signout = async () => {
        await logout()
        navigate('/login', { replace: true });
    }


    // menu 
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    if (!auth?.fullname) {
        return <Navigate to='/login' />
    }

    return (
        <div className='layout'>
            <Navbar openDialog={openDialog} setOpenDialog={setOpenDialog} />
            <div className="navbar-container"></div>
            <section className='main-container'>
                <div className="header">
                    <Box>
                        <Typography variant='h5' lineHeight='2rem' fontWeight='600' mb='-8px' color={'InfoText'} >Dashboard</Typography>
                        <Typography variant='caption' color={'InactiveCaptionText'} >Welcome back, {auth.fullname.split(' ')[0]}</Typography>
                    </Box>
                    <Box
                        display="flex"
                        alignItems="center"
                    >

                        {
                            fullname &&
                            <IconButton onClick={handleClick}>
                                <UserAvatar
                                    fullname={auth.fullname}
                                />
                            </IconButton>
                        }
                        <Box>
                            <Typography variant='body1' mb={-1} fontWeight={600}>{fullname}</Typography>
                            <Typography variant='caption' color={'grey'}>{email}</Typography>
                        </Box>

                        <Menu
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            MenuListProps={{
                                'aria-labelledby': 'basic-button',
                            }}
                        >

                            <MenuItem onClick={() => setOpenDialog(true)}>
                                <ListItemIcon>
                                    <Logout />
                                </ListItemIcon>
                                <ListItemText>Sign out</ListItemText>
                            </MenuItem>

                        </Menu>
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
                    <Button size='small' onClick={() => setOpenDialog(false)} color='secondary'>Cancel</Button>
                    <Button size='small' onClick={signout} color='error'>
                        Sign out
                    </Button>
                </DialogActions>
            </Dialog>
        </div >
    );
}

export default Layout;
