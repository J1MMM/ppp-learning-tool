import React, { useEffect, useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { Box, Button, CircularProgress } from '@mui/material';
import ConfirmationDialog from './ConfirmationDialog';
import SnackBar from './SnackBar';
import UsersTable from './UsersTable';
import AddUserDialog from './AddUserDialog';
import UpdateUserDialog from './UpdateUserDialog';
import useData from '../hooks/useData';
import NoServerResponse from './NoServerResponse';

const Users = () => {
    // ito pala! 
    const axiosPrivate = useAxiosPrivate();

    const { users, setUsers } = useData();
    const [updateUser, setupdateUser] = useState({})

    const [updateUserId, setUpdateUserId] = useState(null)
    const [updateFname, setUpdateFname] = useState("")
    const [updateLname, setUpdateLname] = useState("")
    const [updateMname, setUpdateMname] = useState("")
    const [updateEmail, setUpdateEmail] = useState("")
    const [updatePwd, setUpdatePwd] = useState("")

    const [addUserModal, setAddUserModal] = useState(false)
    const [updateUserModal, setUpdateUserModal] = useState(false)

    const [snack, setSnack] = useState(false)
    const [severity, setSeverity] = useState("success")
    const [deleteModal, setDeleteModal] = useState(false)
    const [deleteUserId, setDeleteUserId] = useState(null)
    const [selectedRows, setSelectedRows] = useState([])
    const [resMsg, setResMsg] = useState("")
    const [noResponse, setNoResponse] = useState(false)

    useEffect(() => {
        window.scrollTo(0, 0);
        let isMounted = true;
        const controller = new AbortController();

        const getUsers = async () => {
            console.log("get user");
            try {
                const response = await axiosPrivate.get('/users', {
                    signal: controller.signal
                });
                setNoResponse(false)

                const sortedData = [...response.data].sort((a, b) => {
                    return a['lastname'].localeCompare(b['lastname']);
                });

                isMounted && setUsers(sortedData)
            } catch (err) {
                setNoResponse(true)
                console.error(err);
            }
        }
        if (users.length == 0) getUsers()

        return () => {
            isMounted = false;
            isMounted && controller.abort();
        }
    }, [])

    const handleDeleteUser = async () => {
        try {
            const response = await axiosPrivate.delete('users', {
                data: { "idsToDelete": selectedRows }
            })

            setUsers(prev => prev.filter(user => !selectedRows.includes(user._id)))
            setResMsg(`${selectedRows.length > 1 ? 'Users have been successfully deleted.' : 'User has been successfully deleted.'}`)
            setSeverity("success")
            setSnack(true)

        } catch (error) {
            console.error(error.message);
            setResMsg('Failed to delete')
            setSeverity("error")
            setSnack(true)
        }
        setSelectedRows([])
    }

    const getUser = async (id) => {
        if (updateUserId == id) return null;

        setUpdateUserId("")
        setUpdateFname("")
        setUpdateLname("")
        setUpdateMname("")
        setUpdateEmail("")
        setUpdatePwd("")

        try {
            const response = await axiosPrivate(`/users/${id}`)

            setUpdateUserId(response?.data?._id)
            setUpdateFname(response?.data?.firstname)
            setUpdateLname(response?.data?.lastname)
            setUpdateMname(response?.data?.middlename)
            setUpdateEmail(response?.data?.email)

        } catch (error) {
            console.error(error.message);
        }
    }
    if (noResponse) return <NoServerResponse show={noResponse} />;

    return (
        <Box>
            <UsersTable
                users={users}
                setDeleteModal={setDeleteModal}
                setUpateUserModal={setUpdateUserModal}
                getUser={getUser}
                setAddUserModal={setAddUserModal}
                noResponse={noResponse}
                selectedRows={selectedRows}
                setSelectedRows={setSelectedRows}
            />

            <AddUserDialog
                open={addUserModal}
                onClose={setAddUserModal}
                setResMsg={setResMsg}
                setSnack={setSnack}
                setUsers={setUsers}
                setSeverity={setSeverity}
            />

            <UpdateUserDialog
                open={updateUserModal}
                onClose={setUpdateUserModal}
                setResMsg={setResMsg}
                setSnack={setSnack}
                setUsers={setUsers}
                setSeverity={setSeverity}
                updateUserId={updateUserId}
                updateFname={updateFname}
                updateLname={updateLname}
                updateMname={updateMname}
                updateEmail={updateEmail}
                setUpdateFname={setUpdateFname}
                setUpdateLname={setUpdateLname}
                setUpdateMname={setUpdateMname}
                setUpdateEmail={setUpdateEmail}
                updatePwd={updatePwd}
                setUpdatePwd={setUpdatePwd}
                setUpdateUserId={setUpdateUserId}
            />

            <SnackBar
                open={snack}
                onClose={setSnack}
                msg={resMsg}
                severity={severity}
            />

            <ConfirmationDialog
                title="Delete User"
                content="Are you sure to delete this user?"
                open={deleteModal}
                setOpen={setDeleteModal}
                confirm={handleDeleteUser}
            />
        </Box>
    );
}

export default Users;
