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
    const [resMsg, setResMsg] = useState("")
    const [noResponse, setNoResponse] = useState(false)

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getUsers = async () => {
            console.log("get user");
            try {
                const response = await axiosPrivate.get('/users', {
                    signal: controller.signal
                });
                setNoResponse(false)
                isMounted && setUsers(response.data)
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
                data: {
                    "id": deleteUserId
                }
            })
            setUsers(prev => prev.filter(user => user._id !== deleteUserId))
            setResMsg('User deleted successfully')
            setSeverity("success")
            setSnack(true)

        } catch (error) {
            console.error(error.message);
            setResMsg('Failed to delete')
            setSeverity("error")
            setSnack(true)
        }
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
                setDeleteUserId={setDeleteUserId}
                setUpateUserModal={setUpdateUserModal}
                getUser={getUser}
                setAddUserModal={setAddUserModal}
                noResponse={noResponse}
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
