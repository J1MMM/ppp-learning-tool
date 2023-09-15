import { Box, Button, Chip, CircularProgress, Grow, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from '@mui/material';
import React from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import UserAvatar from './UserAvatar';
import { Add, DeleteOutline, EditOutlined } from '@mui/icons-material';
import NoServerResponse from './NoServerResponse';

const UsersTable = ({ users, setDeleteModal, setDeleteUserId, setUpateUserModal, getUser, setAddUserModal, noResponse }) => {

    return (
        <>
            {noResponse ? <NoServerResponse show={noResponse} /> :
                (<Grow in={true}><TableContainer component={Paper} elevation={3} sx={{ position: 'relative', boxSizing: 'border-box', borderRadius: 3, zIndex: 10 }}>
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
                                <Typography variant='h5' >Users Management</Typography>
                                <Chip label={`${users?.length} ${users.length <= 1 ? 'User' : 'Users'}`} sx={{ fontFamily: 'Poppins, sans-serif', color: 'primary.main' }} size='small' />
                            </Box>
                            <Typography variant='caption' color='InactiveCaptionText' >Overview of users and their roles for administrative purposes.</Typography>
                        </Box>

                        <Button
                            variant='contained'
                            size='small'
                            onClick={() => setAddUserModal(true)} sx={{ mb: 2 }}


                        >
                            <Add />
                            <Typography pr={1} variant='button'>
                                create account
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
                                <TableCell sx={{ color: 'grey', fontSize: { xs: "x-small", sm: "x-small", md: "small" }, minWidth: "5rem" }}>Roles</TableCell>
                                <TableCell sx={{ color: 'grey', fontSize: { xs: "x-small", sm: "x-small", md: "small" }, minWidth: "5rem" }} >Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users?.map((user, index) => {
                                let role = Object.values(user?.roles)?.splice(1) == "" ? "Teacher" : "Admin";
                                const fullname = `${user.firstname} ${user.lastname}`

                                return (
                                    <TableRow
                                        hover
                                        key={index}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell sx={{ fontSize: { xs: "x-small", sm: "x-small", md: "small" }, minWidth: "5rem" }}>{user.firstname}</TableCell>
                                        <TableCell sx={{ fontSize: { xs: "x-small", sm: "x-small", md: "small" }, minWidth: "5rem" }}>{user.lastname}</TableCell>
                                        <TableCell sx={{ fontSize: { xs: "x-small", sm: "x-small", md: "small" }, minWidth: "5rem" }}>{user.middlename}</TableCell>
                                        <TableCell sx={{ fontSize: { xs: "x-small", sm: "x-small", md: "small" }, minWidth: "5rem" }}>
                                            <Box display='flex' alignItems='center' gap={1}>
                                                <UserAvatar fullname={fullname} height={'35px'} width={'35px'} fontSize="70%" />
                                                {user.email}
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ fontSize: { xs: "x-small", sm: "x-small", md: "small" }, minWidth: "5rem" }}>
                                            <Chip label={role} sx={{ fontFamily: 'Poppins, sans-serif', color: role === 'Admin' ? 'primary.main' : 'InactiveCaptionText', bgcolor: '#EFF4FF' }} />
                                        </TableCell>
                                        <TableCell  >
                                            <Box
                                                width="fit-content"
                                                display="flex"
                                                gap={1}
                                            >
                                                {role !== "Admin" &&
                                                    <Tooltip title="Delete"  >
                                                        <IconButton
                                                            color='error'
                                                            onClick={() => {
                                                                setDeleteModal(true)
                                                                setDeleteUserId(user._id)

                                                            }}>
                                                            <DeleteOutline />
                                                        </IconButton>
                                                    </Tooltip>
                                                }
                                                <Tooltip title="Edit">
                                                    <IconButton
                                                        onClick={() => {
                                                            setUpateUserModal(true)
                                                            getUser(user?._id)
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
                    {users.length < 1 &&
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
                </TableContainer></Grow>)}
        </>
    );
}

export default UsersTable;
