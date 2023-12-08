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

    const { users, setUsers, setStudents, setLessons } = useData();
    const [updateUser, setupdateUser] = useState({})

    const [updateUserId, setUpdateUserId] = useState(null)
    const [updateFname, setUpdateFname] = useState("")
    const [updateLname, setUpdateLname] = useState("")
    const [updateMname, setUpdateMname] = useState("")
    const [updateEmail, setUpdateEmail] = useState("")
    const [updatePwd, setUpdatePwd] = useState("")
    const [updateGender, setUpdateGender] = useState("")
    const [updateAddress, setUpdateAddress] = useState("")
    const [updateContactNo, setUpdateContactNo] = useState("")

    const [addUserModal, setAddUserModal] = useState(false)
    const [updateUserModal, setUpdateUserModal] = useState(false)

    const [snack, setSnack] = useState(false)
    const [severity, setSeverity] = useState("success")
    const [deleteModal, setDeleteModal] = useState(false)
    const [selectedRows, setSelectedRows] = useState([])
    const [resMsg, setResMsg] = useState("")
    const [noResponse, setNoResponse] = useState(false)

    const [sorted, setSorted] = useState(false)

    useEffect(() => {
        window.scrollTo(0, 0);
        let isMounted = true;
        const controller = new AbortController();

        const getUsers = async () => {
            try {
                const response = await axiosPrivate.get('/users', {
                    signal: controller.signal
                });
                setNoResponse(false)

                isMounted && setUsers(response.data?.filter(user => user.archive == false))
            } catch (err) {
                setNoResponse(true)
                console.error(err);
            }
        }
        getUsers()

        return () => {
            isMounted = false;
            isMounted && controller.abort();
        }
    }, [])

    const handleDeleteUser = async () => {
        try {
            const response = await axiosPrivate.patch('users',
                { "idsToDelete": selectedRows, "toAchive": true }
            )

            setUsers(prev => prev.filter(user => !selectedRows.includes(user._id)))
            // setStudents(prev => prev.filter(user => !selectedRows.includes(user.teacherID)))
            // setLessons(prev => prev.filter(user => !selectedRows.includes(user.teacherID)))

            setResMsg(`${selectedRows.length > 1 ? 'Users Archived successfully.' : 'User Archived successfully.'}`)
            setSeverity("success")
            setSnack(true)

        } catch (error) {
            console.error(error.message);
            setResMsg('Failed to Archived')
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
        setUpdateGender("")
        setUpdateAddress("")
        setUpdateContactNo("")

        try {
            const response = await axiosPrivate(`/users/${id}`)

            setUpdateUserId(response?.data?._id)
            setUpdateFname(response?.data?.firstname)
            setUpdateLname(response?.data?.lastname)
            setUpdateMname(response?.data?.middlename)
            setUpdateEmail(response?.data?.email)
            setUpdateGender(response?.data?.gender)
            setUpdateAddress(response?.data?.address)
            setUpdateContactNo(response?.data?.contactNo)

        } catch (error) {
            console.error(error.message);
        }
    }

    useEffect(() => {
        const sortBy = sorted ? 'lastname' : '_id'

        const sortedData = [...users].sort((a, b) => {
            return a[sortBy].localeCompare(b[sortBy]);
        });

        setUsers(sortedData)

    }, [sorted])

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
                setSorted={setSorted}
                sorted={sorted}
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
                setUpdateAddress={setUpdateAddress}
                setUpdateContactNo={setUpdateContactNo}
                setUpdateGender={setUpdateGender}
                updateAddress={updateAddress}
                updateContactNo={updateContactNo}
                updateGender={updateGender}
            />

            <SnackBar
                open={snack}
                onClose={setSnack}
                msg={resMsg}
                severity={severity}
            />

            <ConfirmationDialog
                title={`Archive User${selectedRows.length > 1 ? 's' : ''}`}
                content={`Are you sure you want to archive this User${selectedRows.length > 1 ? 's' : ''} data?`}
                open={deleteModal}
                setOpen={setDeleteModal}
                confirm={handleDeleteUser}
            />
        </Box>
    );
}

export default Users;
