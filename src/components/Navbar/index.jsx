import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import ROLES_LIST from '../ROLES_LIST'
import logoSrc from '../../assets/images/ppp-logo.svg'
import dashboardLogo from '../../assets/images/dashboard-logo.svg'
import { IoHomeOutline, IoPersonOutline, IoFolderOpenOutline, IoLogOutOutline } from 'react-icons/io5'
import { HiOutlineUserGroup } from 'react-icons/hi2'
import { FiUser, FiHome, FiUsers, FiLogOut } from 'react-icons/fi'
import { GrGroup } from 'react-icons/gr'
import './style.scss'
import UseLogout from '../../hooks/useLogout';

const Navbar = ({ setOpenDialog }) => {
    const { auth } = useAuth();
    const isAdmin = Boolean(auth?.roles?.find(role => role === ROLES_LIST.Admin))

    return (
        <div className='navbar'>
            <NavLink to='/' className='ppp-logo-container'>
                <img className='ppp-logo' src={dashboardLogo} alt='logo.svg' />
            </NavLink>

            <nav>
                <NavLink to="/">
                    <FiHome size={22} />
                    <span>Overview</span>
                </NavLink>


                <NavLink to="lessons">
                    <IoFolderOpenOutline size={22} />
                    <span>Lessons</span>
                </NavLink>


                <NavLink to="students">
                    <HiOutlineUserGroup size={26} />
                    <span>Students</span>
                </NavLink>

                {isAdmin
                    &&
                    <NavLink to="users">
                        <FiUsers size={22} />
                        <span>Users List</span>
                    </NavLink>
                }

            </nav>

            <button className='sign-out-btn' onClick={() => setOpenDialog(true)}>
                <FiLogOut size={22} />
                <span>Sign out</span>
            </button>
        </div>
    );
}

export default Navbar;
