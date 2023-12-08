import { Box, Button, Checkbox, Chip, CircularProgress, Collapse, Grow, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Tooltip, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import useData from '../hooks/useData';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { BsArrowCounterclockwise } from 'react-icons/bs';
import { Close, EditOutlined, InfoOutlined } from '@mui/icons-material';
import { PiGenderFemaleBold, PiGenderMaleBold } from 'react-icons/pi';
import UserAvatar from './UserAvatar';
import emptyTable from '../assets/images/undraw_empty_re_opql.svg'
import ConfirmationDialog from './ConfirmationDialog';
import SnackBar from './SnackBar';


const UserArchive = () => {
    const { userArchived, setUserArchived } = useData();
    const axiosPrivate = useAxiosPrivate();
    const [selectedRows, setSelectedRows] = useState([])
    const [mobileView, setMobileView] = useState(false)
    const [isEmpty, setIsEmpty] = useState(false)

    const [restoreConfirmation, setRestoreConfirmation] = useState(false)
    const [deleteConfirmation, setDeleteConfirmation] = useState(false)
    const [snack, setSnack] = useState(false)
    const [severity, setSeverity] = useState("success")
    const [resMsg, setResMsg] = useState("")


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

    useEffect(() => {
        window.scrollTo(0, 0);
        let isMounted = true;
        const controller = new AbortController();

        const getUsers = async () => {
            try {
                const response = await axiosPrivate.get('/users', {
                    signal: controller.signal
                });

                const filterResponse = response.data?.filter(user => user.archive == true)
                if (filterResponse.length == 0) {
                    setIsEmpty(true)
                }
                isMounted && setUserArchived(filterResponse)
            } catch (err) {
                console.error(err);
            }
        }
        getUsers()

        return () => {
            isMounted = false;
            isMounted && controller.abort();
        }
    }, [])

    const restoreUsers = async () => {
        try {
            const response = await axiosPrivate.patch('/users', { "idsToDelete": selectedRows, "toAchive": false })

            setUserArchived(response.data.filter(user => user.archive == true))
            if (response.data.filter(user => user.archive == true).length == 0) {
                setIsEmpty(true)
            }
            console.log(response.data.length);
            setResMsg('User restored successfully')
            setSeverity("success")
            setSnack(true)

        } catch (error) {
            console.error(error.response.data.message);
            setResMsg('Failed to restore')
            setSeverity("error")
            setSnack(true)
        }
        setSelectedRows([])
    }

    const deleteUsers = async () => {
        try {
            const response = await axiosPrivate.delete('/users', { data: { "idsToDelete": selectedRows } })
            setUserArchived(response.data.filter(user => user.archive == true))
            setResMsg('Users Deleted successfully')
            setSeverity("success")
            setSnack(true)
            if (response.data.filter(user => user.archive == true).length == 0) {
                setIsEmpty(true)
            }
        } catch (error) {
            console.error(error.response.data.message);
            setResMsg('Failed to delete')
            setSeverity("error")
            setSnack(true)
        }
        setSelectedRows([])
    }

    const handleRowClick = (rowId) => {
        if (selectedRows.includes(rowId)) {
            setSelectedRows(selectedRows.filter((id) => id !== rowId));
        } else {
            setSelectedRows([...selectedRows, rowId]);
        }
    };

    return (
        <Grow in={true}><TableContainer component={Paper} elevation={3} sx={{ position: 'relative', boxSizing: 'border-box', borderRadius: 3, zIndex: 10 }}>
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
                }}
            >
                <Box sx={{ mb: { xs: 2, sm: 0 } }}>
                    <Box display='flex' alignItems='center' gap={1} mb={-.5}>
                        <Typography component={'span'} variant='h5' >Archived Users</Typography>
                        <Chip label={`${userArchived?.length} ${userArchived.length <= 1 ? 'User' : 'Users'}`} sx={{ fontFamily: 'Poppins, sans-serif', color: 'primary.main' }} size='small' />
                    </Box>
                    <Typography component={'span'} variant='caption' color='InactiveCaptionText' >Collection of Users records you have archived</Typography>
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
                <TableHead sx={{ bgcolor: '#FCFCFD' }}>
                    <TableRow>
                        <TableCell colSpan={6} padding='none'>
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
                                        onClick={() => setDeleteConfirmation(true)}
                                    >
                                        Delete
                                    </Button>
                                </Box>
                            </Collapse>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell sx={{ color: 'grey', fontSize: { xs: "x-small", sm: "x-small", md: "small" }, minWidth: "5rem" }}>Fullname</TableCell>
                        <TableCell sx={{ color: 'grey', fontSize: { xs: "x-small", sm: "x-small", md: "small" }, minWidth: "5rem" }}>Email</TableCell>
                        <TableCell sx={{ color: 'grey', fontSize: { xs: "x-small", sm: "x-small", md: "small" }, minWidth: "5rem" }}>Address</TableCell>
                        <TableCell sx={{ color: 'grey', fontSize: { xs: "x-small", sm: "x-small", md: "small" }, minWidth: "5rem" }}>Contact no.</TableCell>
                        <TableCell sx={{ color: 'grey', fontSize: { xs: "x-small", sm: "x-small", md: "small" }, minWidth: "5rem" }}>Roles</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {userArchived?.map((user, index) => {
                        const fullname = `${user.firstname} ${user.lastname}`

                        return (
                            <TableRow
                                key={index}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: '#e8fee9' }, bgcolor: selectedRows.includes(user._id) ? '#e8fee9' : '#FFF' }}
                                onClick={() => handleRowClick(user._id)}
                            >
                                <TableCell padding='checkbox' sx={{ fontSize: { xs: "x-small", sm: "x-small", md: "small" }, minWidth: { xs: "12rem", sm: "12rem", md: "15rem" } }}>
                                    <Checkbox
                                        size={mobileView ? 'small' : 'medium'}
                                        color="primary"
                                        inputProps={{
                                            'aria-label': 'select row',
                                        }}
                                        checked={selectedRows.includes(user._id)}
                                        onClick={() => handleRowClick(user._id)}
                                    />
                                    <Typography component={'span'} variant='inherit' mr={1} >
                                        {user.lastname}, {user.firstname} {user.middlename}
                                    </Typography>
                                    {user.gender == "male" ? <PiGenderMaleBold color='rgb(2,170,232)' /> : <PiGenderFemaleBold color='#EF5890' />}

                                </TableCell>
                                <TableCell sx={{ fontSize: { xs: "x-small", sm: "x-small", md: "small" }, minWidth: "5rem" }}>
                                    <Box display='flex' alignItems='center' gap={1}>
                                        <UserAvatar fullname={fullname} height={'35px'} width={'35px'} fontSize="70%" />
                                        {user.email}
                                    </Box>
                                </TableCell>
                                <TableCell sx={{ fontSize: { xs: "x-small", sm: "x-small", md: "small" }, minWidth: "5rem" }}>
                                    {user.address}
                                </TableCell>
                                <TableCell sx={{ fontSize: { xs: "x-small", sm: "x-small", md: "small" }, minWidth: "5rem" }}>
                                    {user.contactNo}
                                </TableCell>
                                <TableCell sx={{ fontSize: { xs: "x-small", sm: "x-small", md: "small" }, minWidth: "5rem" }}>
                                    <Chip label={'Teacher'} sx={{ fontFamily: 'Poppins, sans-serif', color: 'primary.main', bgcolor: '#EFF4FF', fontSize: 'x-small' }} />
                                </TableCell>

                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
            {userArchived.length < 1 && !isEmpty &&
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
            {isEmpty &&
                <Grow in={isEmpty}>
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
                        <Typography component={'span'} variant='h4' textAlign="center" color='#2F2E41'>No Archive Users Found</Typography>
                    </Box>
                </Grow>
            }
            <ConfirmationDialog
                title={`Restore Confirmation`}
                content={"Are you sure you want to restore all this data? All restored data will be merged into the Users data."}
                open={restoreConfirmation}
                setOpen={setRestoreConfirmation}
                confirm={restoreUsers}
            />
            <ConfirmationDialog
                content={"You may be deleting Users data. After you delete this, it can't be recovered."}
                setOpen={setDeleteConfirmation}
                open={deleteConfirmation}
                title={`Delete User${selectedRows.length > 1 ? 's' : ''}`}
                confirm={deleteUsers}
            />
            <SnackBar
                open={snack}
                onClose={setSnack}
                msg={resMsg}
                severity={severity}
            />
        </TableContainer></Grow >
    );
}

export default UserArchive;
