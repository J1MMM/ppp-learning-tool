import { Box, Button, Checkbox, Chip, CircularProgress, Collapse, Fade, Grow, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography, capitalize } from '@mui/material';
import React, { useEffect, useState } from 'react';
import UserAvatar from './UserAvatar';
import { Add, Close, DeleteOutline, EditOutlined } from '@mui/icons-material';
import useAuth from '../hooks/useAuth';
import emptyTable from '../assets/images/undraw_empty_re_opql.svg'
import NoServerResponse from './NoServerResponse';
import ROLES_LIST from './ROLES_LIST'
import useData from '../hooks/useData';

const StudentsTable = ({
    students,
    setDeleteModal,
    setDeleteStudentId,
    setUpateStudentModal,
    geStudent,
    setAddStudentModal,
    studentsEmpty,
    noServerRes,
    selectedRows,
    setSelectedRows
}) => {
    const { auth } = useAuth();
    const { users } = useData();
    const isAdmin = auth.roles.includes(ROLES_LIST.Admin);

    const [mobileView, setMobileView] = useState(false)

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 900) {
                setMobileView(true)
            } else {
                setMobileView(false)
            }
        }
        handleResize()
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize)
    })

    const handleRowClick = (rowId) => {
        if (selectedRows.includes(rowId)) {
            setSelectedRows(selectedRows.filter((id) => id !== rowId));
        } else {
            setSelectedRows([...selectedRows, rowId]);
        }
    };

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
                    <TableHead sx={{ bgcolor: '#FAFAFA', boxSizing: 'border-box' }}>
                        <TableRow>
                            <TableCell colSpan={5} padding='none'>
                                <Collapse in={selectedRows.length > 0} >
                                    <Box width='100%' bgcolor='primary.main' boxSizing='border-box' display='flex' alignItems='center' gap={3} position='relative' p={1}>
                                        <IconButton size='small' sx={{ color: 'rgb(225, 225, 225)' }} onClick={() => setSelectedRows([])}>
                                            <Close />
                                        </IconButton>
                                        <Typography variant='body1' color='#FFF' sx={{ fontSize: { xs: 'x-small', sm: 'x-small', md: 'small' } }} ml={-2}>{selectedRows.length} selected</Typography>

                                        <Box width='1px' height='32px' bgcolor='rgba(225, 225, 225, .3)' display='block' />

                                        <Button
                                            variant='outlined'
                                            size='small'
                                            sx={{
                                                color: '#FFF',
                                                borderColor: 'rgba(225, 225, 225, .8)',
                                                '&:hover': {
                                                    borderColor: '#FFF',
                                                    bgcolor: 'rgba(255, 255, 255, 0.10)'
                                                },
                                                p: '5px 14px',
                                                fontSize: 'x-small',

                                            }}
                                            onClick={() => {
                                                setDeleteModal(true)
                                            }}>
                                            Delete
                                        </Button>
                                    </Box>
                                </Collapse>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell padding='checkbox' sx={{ color: 'GrayText', fontSize: { xs: "x-small", sm: "x-small", md: "small" }, minWidth: "10rem" }}>
                                <Checkbox
                                    indeterminate={selectedRows.length > 0 && selectedRows.length < students?.length}
                                    checked={selectedRows.length == students.length && selectedRows.length !== 0}
                                    onChange={() =>
                                        setSelectedRows(
                                            selectedRows.length === students.length ? [] : students.map(stu => stu._id)
                                        )
                                    }
                                    size={mobileView ? 'small' : 'medium'}
                                    color="primary"
                                    inputProps={{
                                        'aria-label': 'select all',
                                    }}
                                />
                                Full name
                            </TableCell>
                            <TableCell sx={{ color: 'GrayText', fontSize: { xs: "x-small", sm: "x-small", md: "small" }, minWidth: "5rem" }}>Email</TableCell>
                            <TableCell sx={{ color: 'GrayText', fontSize: { xs: "x-small", sm: "x-small", md: "small" }, minWidth: "5rem" }} >Learning Disabilities</TableCell>
                            {isAdmin && <TableCell sx={{ color: 'GrayText', fontSize: { xs: "x-small", sm: "x-small", md: "small" }, minWidth: "5rem" }} >Instructor</TableCell>}
                            <TableCell sx={{ color: 'GrayText', fontSize: 'small' }} >Actions</TableCell>
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
                                    <Chip size={mobileView ? 'small' : 'medium'} key={index} label={capitalizeFirstLetter(item)} sx={{ bgcolor: '#EFF4FF', fontFamily: 'Poppins, sans-serif', color: item == 'dyslexia' ? '#BF2011' : item == 'dysgraphia' ? '#7F56D9' : '#0FC06B', fontSize: 'x-small' }} />
                                )
                            })

                            return (
                                <TableRow
                                    key={index}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: '#E8F0FE' } }}
                                >
                                    <TableCell padding='checkbox' sx={{ fontSize: { xs: "x-small", sm: "x-small", md: "small" }, minWidth: { xs: "10rem", sm: "10rem", md: "15rem" } }}>
                                        <Checkbox
                                            size={mobileView ? 'small' : 'medium'}
                                            color="primary"
                                            inputProps={{
                                                'aria-label': 'select row',
                                            }}
                                            checked={selectedRows.includes(student._id)}
                                            onClick={() => handleRowClick(student._id)}
                                        />
                                        {student.lastname}, {student.firstname} {student.middlename}
                                    </TableCell>
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
                                    {isAdmin && <TableCell sx={{ fontSize: { xs: "x-small", sm: "x-small", md: "small" }, minWidth: "8rem" }}>{student.instructor}</TableCell>}
                                    <TableCell  >
                                        <Box
                                            width="fit-content"
                                            display="flex"
                                            gap={1}
                                        >
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
                                width: '100%',
                                maxWidth: '25rem'
                            }} />
                            <Typography variant='h4' textAlign="center" color='#2F2E41'>No Students Found</Typography>
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
