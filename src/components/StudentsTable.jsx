import { Box, Button, Checkbox, Chip, CircularProgress, Collapse, Fade, Grow, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Tooltip, Typography, capitalize } from '@mui/material';
import React, { useEffect, useState } from 'react';
import UserAvatar from './UserAvatar';
import { Add, ArrowUpward, Close, DeleteOutline, EditOutlined, Info, InfoOutlined } from '@mui/icons-material';
import useAuth from '../hooks/useAuth';
import emptyTable from '../assets/images/undraw_empty_re_opql.svg'
import NoServerResponse from './NoServerResponse';
import ROLES_LIST from './ROLES_LIST'
import useData from '../hooks/useData';
import { PiGenderFemaleBold, PiGenderMaleBold } from "react-icons/pi";
import { MdOutlineDraw } from 'react-icons/md';
import { GoNumber } from 'react-icons/go';
import { VscBook } from "react-icons/vsc";

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
    setSelectedRows,
    setAlphabetically,
    alphabetically
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
                            <Typography component={'span'} variant='h5' >Students Management</Typography>
                            <Chip label={`${students.length == 0 ? 'Empty' : students.length > 1 ? `${students.length} Students` : `${students.length} Student`}`} sx={{ fontFamily: 'Poppins, sans-serif', color: 'primary.main' }} size='small' />
                        </Box>
                        <Typography component={'span'} variant='caption' color='InactiveCaptionText' >Insights and information about different students within the institution.</Typography>
                    </Box>

                    <Button
                        variant='contained'
                        size='small'
                        onClick={() => setAddStudentModal(true)} sx={{ mb: 2 }}
                    >
                        <Add sx={{ color: '#FFF' }} />
                        <Typography component={'span'} pr={1} variant='caption' color="white">
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
                                        <Typography component={'span'} variant='body1' color='#FFF' sx={{ fontSize: { xs: 'x-small', sm: 'x-small', md: 'small' } }} ml={-2}>{selectedRows.length} selected</Typography>

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
                                            Archive
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
                                    disabled={students.length == 0}
                                />
                                <TableSortLabel active={alphabetically} direction={alphabetically ? 'asc' : 'desc'} onClick={() => setAlphabetically(v => !v)}>Fullname</TableSortLabel>
                            </TableCell>
                            <TableCell sx={{ color: 'GrayText', fontSize: { xs: "x-small", sm: "x-small", md: "small" }, minWidth: "5rem" }}>Email</TableCell>
                            <TableCell sx={{ color: 'GrayText', fontSize: { xs: "x-small", sm: "x-small", md: "small" }, minWidth: "5rem" }} >Learning Disabilities</TableCell>
                            <TableCell sx={{ color: 'GrayText', fontSize: { xs: "x-small", sm: "x-small", md: "small" }, minWidth: "5rem" }} >Stars Collected</TableCell>
                            <TableCell sx={{ color: 'GrayText', fontSize: { xs: "x-small", sm: "x-small", md: "small" } }} >Details</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {students?.map((student, index) => {
                            const fullname = `${student.firstname} ${student.lastname}`

                            function capitalizeFirstLetter(str) {
                                return str.charAt(0).toUpperCase() + str.slice(1);
                            }

                            const disabilitiesChip = student.learning_disabilities?.map((item, index) => {
                                const iconSize = mobileView ? 15 : 20
                                switch (item) {
                                    case 'dyslexia':
                                        return (
                                            <Box key={index} bgcolor={'#f9e8fa'} display={'flex'} justifyContent={'center'} alignItems={'center'} p={1} borderRadius={'50%'} boxSizing={'border-box'} >
                                                <VscBook color='#F75FFF' size={iconSize} />
                                            </Box>
                                        )
                                        break;
                                    case 'dysgraphia':
                                        return (
                                            <Box key={index} bgcolor={'#d9e2ff'} display={'flex'} justifyContent={'center'} alignItems={'center'} p={1} borderRadius={'50%'} boxSizing={'border-box'} >
                                                <MdOutlineDraw color='#3760E3' size={iconSize} />
                                            </Box>
                                        )
                                        break;
                                    case 'dyscalculia':
                                        return (
                                            <Box key={index} bgcolor={'#f7fff8'} display={'flex'} justifyContent={'center'} alignItems={'center'} p={1} borderRadius={'50%'} boxSizing={'border-box'} >
                                                <GoNumber color='#00C914' size={iconSize} />
                                            </Box>
                                        )
                                        break;
                                }
                            })

                            return (
                                <TableRow
                                    key={index}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: '#e8fee9' }, bgcolor: selectedRows.includes(student._id) ? '#e8fee9' : '' }}
                                    onClick={() => handleRowClick(student._id)}
                                >
                                    <TableCell padding='checkbox' sx={{ fontSize: { xs: "x-small", sm: "x-small", md: "small" }, minWidth: { xs: "12rem", sm: "12rem", md: "18rem" } }}>
                                        <Checkbox
                                            size={mobileView ? 'small' : 'medium'}
                                            color="primary"
                                            inputProps={{
                                                'aria-label': 'select row',
                                            }}
                                            checked={selectedRows.includes(student._id)}
                                            onClick={() => handleRowClick(student._id)}
                                        />
                                        <Typography component={'span'} variant='inherit' mr={1} >
                                            {student.lastname}, {student.firstname} {student.middlename}
                                        </Typography>
                                        {student.gender == "male" ? <PiGenderMaleBold color='rgb(2,170,232)' /> : <PiGenderFemaleBold color='#EF5890' />}
                                    </TableCell>
                                    <TableCell sx={{ fontSize: { xs: "x-small", sm: "x-small", md: "small" }, minWidth: "5rem" }}>
                                        <Box display='flex' alignItems='center' gap={1}>
                                            <UserAvatar fullname={fullname} height={'35px'} width={'35px'} fontSize="70%" />
                                            {student.email}
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ fontSize: { xs: "x-small", sm: "x-small", md: "small" }, minWidth: "173px" }}>
                                        <Box
                                            display='flex'
                                            gap={2}
                                            flexWrap='wrap'
                                        >
                                            {disabilitiesChip}
                                        </Box>
                                    </TableCell>
                                    <TableCell >
                                        <Typography width="fit-content" borderRadius={3} color="#2DA544" p=".1rem .8rem" bgcolor="#f7fff8" sx={{ fontSize: { xs: "x-small", sm: "x-small", md: "small" }, minWidth: { xs: "2rem", sm: "2rem", md: "none" } }}>{student.stars} {student.stars > 1 ? "stars" : "star"}</Typography>
                                    </TableCell>
                                    <TableCell  >

                                        <Tooltip title="more info">
                                            <IconButton
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setUpateStudentModal(true);
                                                    geStudent(student?._id);
                                                }}
                                                size={mobileView ? 'small' : 'medium'}
                                            >
                                                <InfoOutlined />
                                            </IconButton>
                                        </Tooltip>
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
                            height="50vh"
                        >
                            <img src={emptyTable} style={{
                                width: '100%',
                                maxWidth: '25rem',
                            }} />
                            <Typography component={'span'} variant='h4' textAlign="center" color='#2F2E41'>No Students Found</Typography>
                        </Box>
                    </Grow>
                }
                {students.length < 1 && !studentsEmpty &&
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
        </Grow >
    )
}

export default StudentsTable;
