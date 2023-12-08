import { Add, Close, InfoOutlined } from '@mui/icons-material';
import { Box, Button, Checkbox, Chip, CircularProgress, Collapse, Grow, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Tooltip, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { GoNumber } from 'react-icons/go';
import { MdOutlineDraw } from 'react-icons/md';
import { PiGenderFemaleBold, PiGenderMaleBold } from 'react-icons/pi';
import { VscBook } from 'react-icons/vsc';
import UserAvatar from './UserAvatar';
import emptyTable from '../assets/images/undraw_empty_re_opql.svg'
import { BsArrowCounterclockwise } from "react-icons/bs";
import { differenceInYears } from 'date-fns';
import StudentsArchivedDialog from './StudentsArchivedDialog';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import ConfirmationDialog from '../components/ConfirmationDialog';
import SnackBar from './SnackBar';
import { useParams } from 'react-router-dom';
import useData from '../hooks/useData';


const StudentsArchived = ({
    setStudentsEmpty,
    setStudentsArchived,
    studentsArchived,
    selectedRows,
    studentsEmpty,
    setSelectedRows,
    alphabetically,
    setAlphabetically,
}) => {
    const { id } = useParams()
    const { archiveMode } = useData()
    const axiosPrivate = useAxiosPrivate()
    const [mobileView, setMobileView] = useState(false)
    const [infoModal, setInfoModal] = useState(false)
    const [restoreConfirmation, setRestoreConfirmation] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)
    const [snack, setSnack] = useState(false)
    const [resMsg, setResMsg] = useState("")
    const [severity, setSeverity] = useState("success")
    const [showInfoId, setShowInfoId] = useState("")
    const [infoFname, setInfoFname] = useState("")
    const [infoLname, setInfoLname] = useState("")
    const [infoMname, setInfoMname] = useState("")
    const [infoEmail, setInfoEmail] = useState("")
    const [infoGender, setInfoGender] = useState("")
    const [infoGuardian, setInfoGuardian] = useState("")
    const [infoAddress, setInfoAddress] = useState("")
    const [infoContactNo, setInfoContactNo] = useState("")
    const [infoDoB, setInfoDoB] = useState("")
    const [infoAge, setInfoAge] = useState("")

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

    const handleDeleteStudent = async () => {
        try {
            const response = await axiosPrivate.delete('/students', { data: { "idsToDelete": selectedRows, "classID": id } })

            setStudentsArchived(response.data.filter(student => student.archive == true))
            setResMsg('Student Deleted successfully')
            setSeverity("success")
            setSnack(true)
            if (response.data.filter(student => student.archive == true).length == 0) {
                setStudentsEmpty(true)
            }

        } catch (error) {
            console.error(error.response.data.message);
            setResMsg('Failed to delete')
            setSeverity("error")
            setSnack(true)
        }

        setSelectedRows([])
    }

    const [disabilities, setDisabilities] = useState({
        dyslexia: false,
        dysgraphia: false,
        dyscalculia: false,
    })

    const getStudent = async (id) => {
        if (showInfoId == id) return null;
        setInfoFname("")
        setInfoLname("")
        setInfoMname("")
        setInfoEmail("")
        setInfoGender("")
        setInfoGuardian("")
        setInfoAddress("")
        setInfoContactNo("")
        setInfoDoB(null)
        setInfoAge("")

        try {
            const studentInfo = await studentsArchived.filter(v => v._id == id)
            const parseDate = new Date(studentInfo[0].birthday)

            setInfoFname(studentInfo[0].firstname)
            setInfoLname(studentInfo[0].lastname)
            setInfoMname(studentInfo[0].middlename)
            setInfoEmail(studentInfo[0].email)
            setInfoGender(studentInfo[0].gender)
            setInfoAddress(studentInfo[0].address)
            setInfoGuardian(studentInfo[0].guardian)
            setInfoContactNo(studentInfo[0].contactNo)
            setInfoDoB(parseDate)

            // compute age 
            const currentDate = new Date();
            const ageInYears = differenceInYears(currentDate, parseDate);

            setInfoAge(`${ageInYears} years old`)

            setDisabilities(prev => {
                const myObj = {
                    dyslexia: false,
                    dysgraphia: false,
                    dyscalculia: false,
                };

                studentInfo[0].learning_disabilities?.map(item => {
                    if (item == 'dyslexia') {
                        myObj.dyslexia = true;
                    }
                    if (item == 'dysgraphia') {
                        myObj.dysgraphia = true;
                    }
                    if (item == 'dyscalculia') {
                        myObj.dyscalculia = true;
                    }
                })
                return myObj
            })
        } catch (error) {
            console.log(error);
        }
    }
    const handleRestoreStudents = async () => {
        try {
            const response = await axiosPrivate.patch('/students', { "idsToDelete": selectedRows, "toAchive": false, "classID": id })

            setStudentsArchived(response.data.filter(student => student.archive == true))
            setResMsg('Student restored successfully')
            setSeverity("success")
            setSnack(true)
            if (response.data.filter(student => student.archive == true).length == 0) {
                setStudentsEmpty(true)
            }

        } catch (error) {
            console.error(error.response.data.message);
            setResMsg('Failed to restore')
            setSeverity("error")
            setSnack(true)
        }

        setSelectedRows([])

    }

    return (
        <TableContainer component={Box} sx={{ position: 'relative', boxSizing: 'border-box', zIndex: 10 }}>
            <Box
                bgcolor='#fff'
                display='flex'
                justifyContent='space-between'
                boxSizing='border-box'
                position='sticky'
                top='0'
                left='0'
                zIndex='99'
                p={2}
                pb={1}
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
                        <Typography component={'span'} variant='h5' >Archived Students</Typography>
                        <Chip label={`${studentsArchived.length} Student${studentsArchived.length > 1 ? 's' : ''}`} sx={{ fontFamily: 'Poppins, sans-serif', color: 'primary.main' }} size='small' />
                    </Box>
                    <Typography component={'span'} variant='caption' color='InactiveCaptionText' >Collection of Student records you have archived</Typography>
                </Box>

                <Button
                    disabled={selectedRows.length == 0}
                    variant='contained'
                    size='small'
                    sx={{
                        height: 'fit-content'
                    }}
                    onClick={() => setRestoreConfirmation(true)}
                >
                    <BsArrowCounterclockwise color={'#FFF'} size={20} />
                    <Typography ml={1} component={'span'} pr={1} variant='caption' color="white">
                        restore
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


                                    <Box width='1px' height='32px' bgcolor='rgba(225, 225, 225, .3)' display='block' />


                                </Box>
                            </Collapse>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell padding='checkbox' sx={{ color: 'GrayText', fontSize: { xs: "x-small", sm: "x-small", md: "small" }, minWidth: "10rem" }}>
                            <Checkbox
                                indeterminate={selectedRows.length > 0 && selectedRows.length < studentsArchived?.length}
                                checked={selectedRows.length == studentsArchived.length && selectedRows.length !== 0}
                                onChange={() =>
                                    setSelectedRows(
                                        selectedRows.length === studentsArchived.length ? [] : studentsArchived.map(stu => stu._id)
                                    )
                                }
                                size={mobileView ? 'small' : 'medium'}
                                color="primary"
                                inputProps={{
                                    'aria-label': 'select all',
                                }}
                                disabled={studentsArchived.length == 0 || archiveMode}
                            />
                            <TableSortLabel active={alphabetically} direction={alphabetically ? 'asc' : 'desc'} onClick={() => !archiveMode && setAlphabetically(v => !v)}>Fullname</TableSortLabel>
                        </TableCell>
                        <TableCell sx={{ color: 'GrayText', fontSize: { xs: "x-small", sm: "x-small", md: "small" }, minWidth: "5rem" }}>Email</TableCell>
                        <TableCell sx={{ color: 'GrayText', fontSize: { xs: "x-small", sm: "x-small", md: "small" }, minWidth: "5rem" }} >Learning Disabilities</TableCell>
                        <TableCell sx={{ color: 'GrayText', fontSize: { xs: "x-small", sm: "x-small", md: "small" }, minWidth: "5rem" }} >Stars Collected</TableCell>
                        <TableCell sx={{ color: 'GrayText', fontSize: { xs: "x-small", sm: "x-small", md: "small" } }} >Details</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {studentsArchived?.map((student, index) => {
                        const fullname = `${student.firstname} ${student.lastname}`

                        const disabilitiesChip = student?.learning_disabilities?.map((item, index) => {
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
                                onClick={() => !archiveMode && handleRowClick(student._id)}
                            >
                                <TableCell padding='checkbox' sx={{ fontSize: { xs: "x-small", sm: "x-small", md: "small" }, minWidth: { xs: "12rem", sm: "12rem", md: "18rem" } }}>
                                    <Checkbox
                                        disabled={archiveMode}
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
                                                setInfoModal(true)
                                                setShowInfoId(student._id)
                                                getStudent(student._id)
                                                e.stopPropagation();
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

                    >
                        <img src={emptyTable} style={{
                            width: '100%',
                            maxWidth: '15rem',
                        }} />
                        <Typography component={'span'} variant='h5' textAlign="center" color='#2F2E41'>No Students have been Archived</Typography>
                    </Box>
                </Grow>
            }
            {studentsArchived.length < 1 && !studentsEmpty &&
                <Box
                    width="100%"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    boxSizing="border-box"
                    height="30vh"
                >
                    <CircularProgress />
                </Box>
            }
            <StudentsArchivedDialog
                disabilities={disabilities}
                infoAddress={infoAddress}
                infoAge={infoAge}
                infoContactNo={infoContactNo}
                infoDoB={infoDoB}
                infoEmail={infoEmail}
                infoFname={infoFname}
                infoGender={infoGender}
                infoGuardian={infoGuardian}
                infoLname={infoLname}
                infoMname={infoMname}
                onClose={setInfoModal}
                open={infoModal}
            />
            <ConfirmationDialog
                content={"You may be deleting students data. After you delete this, it can't be recovered."}
                setOpen={setDeleteModal}
                open={deleteModal}
                title={`Delete Student${selectedRows.length > 1 ? 's' : ''}`}
                confirm={handleDeleteStudent}
            />
            <ConfirmationDialog
                title={`Restore Confirmation`}
                content={"Are you sure you want to restore all this data? All restored data will be merged into the Students data."}
                open={restoreConfirmation}
                setOpen={setRestoreConfirmation}
                confirm={handleRestoreStudents}
            />

            <SnackBar
                open={snack}
                onClose={setSnack}
                msg={resMsg}
                severity={severity}
            />
        </TableContainer>
    );
}

export default StudentsArchived;
