import React, { useEffect, useState } from 'react';
import { Link, ScrollRestoration, useNavigate } from 'react-router-dom';
import UseLogout from '../hooks/useLogout';
import useAuth from '../hooks/useAuth';
import { Box, Button, Grow, Paper, Slide, Typography } from '@mui/material';
import { HiOutlineUserGroup, HiMiniArrowSmallUp, HiMiniArrowUp } from 'react-icons/hi2';
import { ArrowUpward, FolderShared, FolderSharedOutlined } from '@mui/icons-material';
import { PiFolderSimpleUserDuotone } from "react-icons/pi";
import useData from '../hooks/useData';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import NoServerResponse from './NoServerResponse';
import ROLES_LIST from './ROLES_LIST';
import { PiStudent } from "react-icons/pi";
import { FiUserPlus, FiUsers } from 'react-icons/fi';
import { IoFolderOpen, IoFolderOpenOutline, IoGameControllerOutline } from 'react-icons/io5';
import cardBg from '../assets/images/cardBg.svg';
import OverviewCard from './OverviewCard';
import StudentsTable from './StudentsTable';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import StudentsLeaderborad from './StudentsLeaderborad';
import { BiBrain, BiPencil, BiSolidPencil } from "react-icons/bi";
import { GoNumber } from "react-icons/go";
import { MdOutlineDraw } from "react-icons/md";
import Users from './Users'
import { VscBook } from 'react-icons/vsc';

const Home = () => {
    const { allStudents, setAllStudents, setClasses, classes } = useData();
    const { auth } = useAuth()
    const axiosPrivate = useAxiosPrivate()

    const [noServerRes, setNoServerRes] = useState(false)
    const [studentsEmpty, setStudentsEmpty] = useState(false)

    const totalDyslexia = allStudents.filter(student => student.archive == false && student.learning_disabilities.includes('dyslexia')).length
    const totalDysgraphia = allStudents.filter(student => student.archive == false && student.learning_disabilities.includes('dysgraphia')).length
    const totalDyscalculia = allStudents.filter(student => student.archive == false && student.learning_disabilities.includes('dyscalculia')).length

    const isAdmin = Boolean(auth?.roles?.find(role => role === ROLES_LIST.Admin))
    if (isAdmin) {
        document.title = "Users Management"
        return <Users />
    }

    useEffect(() => {
        document.title = "Home"
        window.scrollTo(0, 0);
        let isMounted = true;
        const controller = new AbortController();

        const getData = async () => {
            try {
                const response = await axiosPrivate.get('/students', {
                    signal: controller.signal
                });

                if (isMounted) {
                    const sortedData = [...response.data.filter(student => student.archive == false)].sort((a, b) => {
                        return b['stars'] - a['stars'];
                    });

                    setAllStudents(sortedData);
                    setNoServerRes(false)
                    setStudentsEmpty(false)

                    if (response.data.filter(student => student.archive == false).length == 0) {
                        setStudentsEmpty(true)
                    }
                }
            } catch (err) {
                setNoServerRes(true)
                console.error(err);
            }
        }

        getData()

        return () => {

            isMounted = false;
            isMounted && controller.abort();
        }
    }, [])



    const cardData = [
        {
            "title": "Total Students",
            "data": allStudents.length,
            "icon": <HiOutlineUserGroup color={"#FFF"} size={20} />,
            "subText": "students registered inside your class"

        },
        {
            "title": "Dyslexia",
            "data": totalDyslexia,
            "icon": <VscBook color={"#2DA544"} size={20} />,
            "subText": "total number of students with dyslexia"
        },
        {
            "title": "Dysgraphia",
            "data": totalDysgraphia,
            "icon": <MdOutlineDraw color={"#2DA544"} size={20} />,
            "subText": "total number of students with dysgraphia"
        },
        {
            "title": "Dyscalculia",
            "data": totalDyscalculia,
            "icon": <GoNumber color={"#2DA544"} size={20} />,
            "subText": "total number of students with dyscalculia"
        },
    ]

    const cardEl = cardData.map((data, index) => {
        return <OverviewCard key={index} data={data} index={index} />
    })

    if (noServerRes) return <NoServerResponse show={noServerRes} />;
    return (
        <Box display="flex" flexDirection="column" gap={2}>
            <Box
                display="grid"
                gap={2}
                // bgcolor="red"
                sx={{
                    gridTemplateColumns: {
                        xs: "1fr",
                        sm: "1fr 1fr",
                        md: "1fr 1fr 1fr 1fr"
                    }
                }}
            >
                {cardEl}
            </Box>

            <StudentsLeaderborad students={allStudents} studentsEmpty={studentsEmpty} />
        </Box >
    );
}

export default Home;
