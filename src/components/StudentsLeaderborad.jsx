import { Add } from '@mui/icons-material';
import { Box, Button, Chip, CircularProgress, Grow, Paper, Slide, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import React from 'react';
import UserAvatar from './UserAvatar';
import useAuth from '../hooks/useAuth';
import ROLES_LIST from './ROLES_LIST';
import { HiOutlineUserGroup } from 'react-icons/hi2';
import emptyTable from '../assets/images/undraw_empty_re_opql.svg'
import { useNavigate } from 'react-router-dom';

const StudentsLeaderborad = ({ students, studentsEmpty }) => {
    const { auth } = useAuth();
    const isAdmin = auth.roles.includes(ROLES_LIST.Admin);
    const navigate = useNavigate()

    return (
        <Grow in={true} >
            <TableContainer component={Paper} elevation={3} sx={{ position: 'relative', boxSizing: 'border-box', borderRadius: 3, zIndex: 10 }}>
                <Box
                    bgcolor='#fff'
                    display='flex'
                    justifyContent='space-between'
                    p={3}
                    pb={1}
                    boxSizing='border-box'
                    position='sticky'
                    top='0'
                    left='0'
                    zIndex='99'

                    sx={{
                        flexDirection: {
                            xs: "column",
                            sm: "row"
                        },
                        gap: {
                            xs: 2,
                            sm: 0
                        }

                    }}
                >
                    <Box>
                        <Box display='flex' alignItems='center' gap={1} mb={-.5}>
                            <Typography component={'span'} variant='h5' >Students Leaderboard</Typography>
                            <Chip label={`${students.length == 0 ? 'Empty' : students.length > 1 ? `${students.length} Students` : `${students.length} Student`}`} sx={{ fontFamily: 'Poppins, sans-serif', color: 'primary.main' }} size='small' />
                        </Box>
                        <Typography component={'span'} variant='caption' color='InactiveCaptionText' sx={{ fontSize: { xs: 9, sm: 12 } }} >An overview of the ratings for all students across various sections in your class.</Typography>
                    </Box>


                </Box>
                <Table sx={{ minWidth: 650, position: 'relative' }} aria-label="simple table" >
                    <TableHead sx={{ bgcolor: '#FCFCFD' }}>
                        <TableRow>
                            <TableCell sx={{ color: 'grey', fontSize: { xs: "x-small", sm: "x-small", md: "small" }, minWidth: "4.5rem" }}>Full name</TableCell>
                            <TableCell sx={{ color: 'grey', fontSize: { xs: "x-small", sm: "x-small", md: "small" }, minWidth: "3.5rem" }}>Email</TableCell>
                            {isAdmin && <TableCell sx={{ color: 'grey', fontSize: { xs: "x-small", sm: "x-small", md: "small" }, minWidth: "3.5rem" }} >Instructor</TableCell>}
                            <TableCell sx={{ color: 'grey', fontSize: { xs: "x-small", sm: "x-small", md: "small" }, minWidth: "5rem" }} >Stars Collected</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {students?.map((student, index) => {
                            const fullname = `${student.firstname} ${student.lastname}`
                            function capitalizeFirstLetter(str) {
                                return str.charAt(0).toUpperCase() + str.slice(1);
                            }

                            return (
                                <TableRow
                                    hover
                                    key={index}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell sx={{ fontSize: { xs: "x-small", sm: "x-small", md: "small" }, minWidth: "10rem" }}>{student.lastname}, {student.firstname} {student.middlename}</TableCell>
                                    <TableCell sx={{ fontSize: { xs: "x-small", sm: "x-small", md: "small" } }}>
                                        <Box display='flex' alignItems='center' gap={1}>
                                            <UserAvatar fullname={fullname} height={'35px'} width={'35px'} fontSize="70%" />
                                            {student.email}
                                        </Box>
                                    </TableCell>
                                    {isAdmin && <TableCell sx={{ fontSize: { xs: "x-small", sm: "x-small", md: "small" }, minWidth: "5rem" }}>{student.instructor}</TableCell>}
                                    <TableCell >
                                        <Typography component={'span'} width="fit-content" borderRadius={3} color="#2DA544" p=".1rem .8rem" bgcolor="#f7fff8" sx={{ fontSize: { xs: "x-small", sm: "x-small", md: "small" }, minWidth: { xs: "2rem", sm: "2rem", md: "none" } }}>{student.stars} {student.stars > 1 ? "stars" : "star"}</Typography>
                                    </TableCell>
                                </TableRow>
                            )
                        })}


                    </TableBody>

                </Table>
                {!studentsEmpty && students.length == 0 &&
                    <Box
                        width="100%"
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        boxSizing="border-box"
                        height="40vh"
                    >
                        <CircularProgress />
                    </Box>

                }
                {studentsEmpty &&
                    <Grow in={studentsEmpty}>
                        <Box

                            display='flex'
                            justifyContent="center"
                            alignItems="center"
                            flexDirection="column"
                            gap={2}
                            margin={5}
                            boxSizing='border-box'
                        >
                            <img src={emptyTable} style={{
                                width: '100%',
                                maxWidth: '18rem'
                            }} />
                            <Typography component={'span'} variant='h5' textAlign='center' color='#2F2E41'>Add students to get started</Typography>
                        </Box>
                    </Grow>
                }
            </TableContainer >
        </Grow>
    )
}

export default StudentsLeaderborad;
