import { Box, Button, Chip, CircularProgress, Fade, Grow, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography, capitalize } from '@mui/material';
import React from 'react';
import UserAvatar from './UserAvatar';
import { Add, DeleteOutline, EditOutlined } from '@mui/icons-material';
import useAuth from '../hooks/useAuth';
import emptyTable from '../assets/images/undraw_empty_re_opql.svg'
import NoServerResponse from './NoServerResponse';
import ROLES_LIST from './ROLES_LIST'

const StudentsTable = ({
    students,
    setDeleteModal,
    setDeleteStudentId,
    setUpateStudentModal,
    geStudent,
    setAddStudentModal,
    studentsEmpty,
    noServerRes
}) => {
    const { auth } = useAuth();
    const isAdmin = auth.roles.includes(ROLES_LIST.Admin);


    return (
        <Grow in={true}>
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
                            sm: "column",
                            md: "row"
                        }
                    }}
                >
                    <Box sx={{ mb: { xs: 2, sm: 0 } }}>
                        <Box display='flex' alignItems='center' gap={1} mb={-.5}>
                            <Typography variant='h5' >Students Management</Typography>
                            <Chip label={`${students.length == 0 ? 'Empty' : students.length > 1 ? `${students.length} Students` : `${students.length} Student`}`} sx={{ fontFamily: 'Poppins, sans-serif', color: 'primary.main' }} size='small' />
                        </Box>
                        <Typography variant='caption' color='InactiveCaptionText' >Insights and information about different students within the institution.</Typography>
                    </Box>

                    <Button
                        variant='contained'
                        size='small'
                        onClick={() => setAddStudentModal(true)} sx={{ mb: 2 }}
                    >
                        <Add />
                        <Typography pr={1} variant='button'>
                            Add Student
                        </Typography>
                    </Button>
                </Box>
                <Table sx={{ minWidth: 650, position: 'relative' }} aria-label="simple table" >
                    <TableHead sx={{ bgcolor: '#FCFCFD' }}>
                        <TableRow>
                            <TableCell sx={{ color: 'grey', fontSize: { xs: "x-small", sm: "x-small", md: "small" }, minWidth: "5rem" }}>First Name</TableCell>
                            <TableCell sx={{ color: 'grey', fontSize: { xs: "x-small", sm: "x-small", md: "small" }, minWidth: "5rem" }}>Last Name</TableCell>
                            <TableCell sx={{ color: 'grey', fontSize: { xs: "x-small", sm: "x-small", md: "small" }, minWidth: "5rem" }}>Middle Name</TableCell>
                            <TableCell sx={{ color: 'grey', fontSize: { xs: "x-small", sm: "x-small", md: "small" }, minWidth: "5rem" }}>Email</TableCell>
                            <TableCell sx={{ color: 'grey', fontSize: { xs: "x-small", sm: "x-small", md: "small" }, minWidth: "5rem" }} >Learning Disabilities</TableCell>
                            {isAdmin && <TableCell sx={{ color: 'grey', fontSize: { xs: "x-small", sm: "x-small", md: "small" }, minWidth: "5rem" }} >Instructor</TableCell>}
                            <TableCell sx={{ color: 'grey', fontSize: 'small' }} >Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {students?.map((student, index) => {
                            const fullname = `${student.firstname} ${student.lastname}`
                            function capitalizeFirstLetter(str) {
                                return str.charAt(0).toUpperCase() + str.slice(1);
                            }

                            const disabilitiesChip = student.learning_disabilities?.map((item, index) => {
                                return (
                                    <Chip key={index} label={capitalizeFirstLetter(item)} sx={{ bgcolor: '#EFF4FF', fontFamily: 'Poppins, sans-serif', color: item == 'dyslexia' ? '#BF2011' : item == 'dysgraphia' ? '#7F56D9' : '#0FC06B', fontSize: 'x-small' }} />
                                )
                            })

                            return (
                                <TableRow
                                    hover
                                    key={index}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell sx={{ fontSize: { xs: "x-small", sm: "x-small", md: "small" }, minWidth: "5rem" }}>{student.firstname}</TableCell>
                                    <TableCell sx={{ fontSize: { xs: "x-small", sm: "x-small", md: "small" }, minWidth: "5rem" }}>{student.lastname}</TableCell>
                                    <TableCell sx={{ fontSize: { xs: "x-small", sm: "x-small", md: "small" }, minWidth: "5rem" }}>{student.middlename}</TableCell>
                                    <TableCell sx={{ fontSize: { xs: "x-small", sm: "x-small", md: "small" }, minWidth: "5rem" }}>
                                        <Box display='flex' alignItems='center' gap={1}>
                                            <UserAvatar fullname={fullname} height={'35px'} width={'35px'} fontSize="70%" />
                                            {student.email}
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ fontSize: { xs: "x-small", sm: "x-small", md: "small" }, minWidth: "18rem" }}>
                                        <Box
                                            display='flex'
                                            gap={1}
                                            flexWrap='wrap'
                                        >
                                            {disabilitiesChip}
                                        </Box>
                                    </TableCell>
                                    {isAdmin && <TableCell sx={{ fontSize: { xs: "x-small", sm: "x-small", md: "small" }, minWidth: "5rem" }}>{student.instructor}</TableCell>}
                                    <TableCell  >
                                        <Box
                                            width="fit-content"
                                            display="flex"
                                            gap={1}
                                        >
                                            <Tooltip title="Delete">
                                                <IconButton
                                                    color='error'
                                                    onClick={() => {
                                                        setDeleteModal(true)
                                                        setDeleteStudentId(student._id)

                                                    }}>
                                                    <DeleteOutline />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Edit">
                                                <IconButton
                                                    onClick={() => {
                                                        setUpateStudentModal(true)
                                                        geStudent(student?._id)
                                                    }}
                                                >
                                                    <EditOutlined />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>

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
                                maxWidth: '25rem'
                            }} />
                            <Typography variant='h4' color='#2F2E41'>No Students Found</Typography>
                        </Box>
                    </Grow>
                }
                {students < 1 && !studentsEmpty &&
                    <Box
                        width="100%"
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        boxSizing="border-box"
                        height="50vh"
                    >
                        <CircularProgress />
                    </Box>
                }
            </TableContainer>
        </Grow>
    )
}

export default StudentsTable;
