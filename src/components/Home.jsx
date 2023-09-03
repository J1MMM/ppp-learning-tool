import React, { useEffect, useState } from 'react';
import { Link, ScrollRestoration, useNavigate } from 'react-router-dom';
import UseLogout from '../hooks/useLogout';
import useAuth from '../hooks/useAuth';
import { Box, Button, Grow, Paper, Typography } from '@mui/material';
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
import ScrollToTop from './ScrollToTop';

const Home = () => {
    const { students, users, lessons, setStudents, setUsers, setLessons } = useData();
    const { auth } = useAuth()
    const axiosPrivate = useAxiosPrivate()

    const [date, setDate] = useState(new Date())
    const [noServerRes, setNoServerRes] = useState(false)
    const [studentsEmpty, setStudentsEmpty] = useState(false)

    const totalDyslexia = students.filter(student => student.learning_disabilities.includes('dyslexia')).length
    const totalDysgraphia = students.filter(student => student.learning_disabilities.includes('dysgraphia')).length
    const totalDyscalculia = students.filter(student => student.learning_disabilities.includes('dyscalculia')).length

    const isAdmin = Boolean(auth?.roles?.find(role => role === ROLES_LIST.Admin))


    useEffect(() => {
        window.scrollTo(0, 0);
        let isMounted = true;
        const controller = new AbortController();

        const getData = async () => {
            console.log("get data");
            try {
                const res1 = await axiosPrivate.get('/students', {
                    signal: controller.signal
                });
                const res2 = isAdmin ? await axiosPrivate.get('/users', {
                    signal: controller.signal
                }) : null
                const res3 = await axiosPrivate.get('/upload', {
                    signal: controller.signal
                });

                if (isMounted) {
                    setStudents(res1.data);
                    setLessons(res3.data.map(data => ({ ...data, show: true })))
                    isAdmin && setUsers(res2.data)
                    setNoServerRes(false)
                    setStudentsEmpty(false)

                    if (res1.data.length == 0) {
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
            "data": students.length,
            "icon": <HiOutlineUserGroup color={"#FFF"} size={20} />,
            "subText": isAdmin ? "total count of registered students" : "students registered inside your class"

        },
        {
            "title": "Dyslexia",
            "data": totalDyslexia,
            "icon": <BiBrain color={"#434ce6"} size={20} />,
            "subText": "total number of students with dyslexia"
        },
        {
            "title": "Dysgraphia",
            "data": totalDysgraphia,
            "icon": <MdOutlineDraw color={"#434ce6"} size={20} />,
            "subText": "total number of students with dysgraphia"
        },
        {
            "title": "Dyscalculia",
            "data": totalDyscalculia,
            "icon": <GoNumber color={"#434ce6"} size={20} />,
            "subText": "total number of students with dyscalculia"
        },
    ]

    const cardEl = cardData.map((data, index) => {
        return <OverviewCard key={index} data={data} index={index} />
    })

    if (noServerRes) return <NoServerResponse show={noServerRes} />;
    return (
        <Box display="flex" flexDirection="column" gap={2}>
            <Box display="flex" gap={2}>
                <Box
                    className="card-container"
                    display="grid"
                    gridTemplateColumns="1fr 1fr"
                    gap={2}
                >
                    {cardEl}
                </Box>
                <Grow in={true} >
                    <Paper elevation={2} sx={{ bgcolor: "#FFF", width: "100%", borderRadius: 2, overflow: 'hidden', minHeight: '395px' }}>
                        <Calendar value={date} />
                    </Paper>
                </Grow>
            </Box>

            <StudentsLeaderborad students={students} studentsEmpty={studentsEmpty} />
        </Box >
    );
}

export default Home;
