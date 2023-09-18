import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import StudentsTable from './StudentsTable';
import AddStudentDialog from './AddStudentDialog';
import SnackBar from './SnackBar';
import ConfirmationDialog from './ConfirmationDialog';
import UpdateStudentDialog from './UpdateStudentDialog';
import useData from '../hooks/useData';
import NoServerResponse from './NoServerResponse';

const Students = () => {
    const { students, setStudents } = useData()

    const axiosPrivate = useAxiosPrivate()
    const [studentsEmpty, setStudentsEmpty] = useState(false)
    const [addStudentsModal, setAddStudentsModal] = useState(false)
    const [updateStudentsModal, setUpdateStudentsModal] = useState(false)
    const [updateStudentId, setUpdateStudentId] = useState("")
    const [deleteStudentId, setDeleteStudentId] = useState(null)
    const [selectedRows, setSelectedRows] = useState([])
    const [deleteModal, setDeleteModal] = useState(false)

    const [resMsg, setResMsg] = useState("")
    const [snack, setSnack] = useState(false)
    const [severity, setSeverity] = useState("success")
    const [noServerRes, setNoServerRes] = useState(false)

    const [updateFname, setUpdateFname] = useState("")
    const [updateLname, setUpdateLname] = useState("")
    const [updateMname, setUpdateMname] = useState("")
    const [updateEmail, setUpdateEmail] = useState("")
    const [updatePwd, setUpdatePwd] = useState("")
    const [disabilities, setDisabilities] = useState({
        dyslexia: false,
        dysgraphia: false,
        dyscalculia: false,
    })


    useEffect(() => {
        window.scrollTo(0, 0);
        let isMounted = true;
        const controller = new AbortController();

        const getStudents = async () => {
            try {
                const response = await axiosPrivate.get('/students', {
                    signal: controller.signal
                });

                if (response.data?.length == 0) {
                    setStudentsEmpty(true)
                }

                const sortedData = [...response.data].sort((a, b) => {
                    return a['lastname'].localeCompare(b['lastname']);
                });

                isMounted && setStudents(sortedData)

            } catch (err) {
                setNoServerRes(true)
                console.error(err);
            }
        }
        if (students.length == 0) getStudents();

        return () => {
            isMounted = false;
            isMounted && controller.abort();
        }
    }, [])

    useEffect(() => {
        if (students.length > 0) {
            setStudentsEmpty(false)
        }
    }, [students])

    const handleDeleteStudent = async () => {
        try {
            const response = await axiosPrivate.delete('/students', {
                data: { "idsToDelete": selectedRows }
            })
            setStudents(prev => prev.filter(user => !selectedRows.includes(user._id)))
            if (students.length == 0) {
                setStudentsEmpty(true)
            }
            setResMsg('Student deleted successfully')
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

    const getStudent = async (id) => {
        if (updateStudentId == id) return null;

        setUpdateStudentId("")
        setUpdateFname("")
        setUpdateLname("")
        setUpdateMname("")
        setUpdateEmail("")
        try {
            const response = await axiosPrivate(`/students/${id}`)

            setUpdateStudentId(response?.data?._id)
            setUpdateFname(response?.data?.firstname)
            setUpdateLname(response?.data?.lastname)
            setUpdateMname(response?.data?.middlename)
            setUpdateEmail(response?.data?.email)

            setDisabilities(prev => {
                const myObj = {
                    dyslexia: false,
                    dysgraphia: false,
                    dyscalculia: false,
                };

                response?.data?.learning_disabilities?.map(item => {
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
            console.error(error);
        }

    }

    if (noServerRes) return <NoServerResponse show={noServerRes} />;


    return (
        <Box>
            <StudentsTable
                students={students}
                setStudents={setStudents}
                setAddStudentModal={setAddStudentsModal}
                setDeleteStudentId={setDeleteStudentId}
                setDeleteModal={setDeleteModal}
                setUpateStudentModal={setUpdateStudentsModal}
                geStudent={getStudent}
                studentsEmpty={studentsEmpty}
                noServerRes={noServerRes}
                selectedRows={selectedRows}
                setSelectedRows={setSelectedRows}
            />

            <AddStudentDialog
                open={addStudentsModal}
                onClose={setAddStudentsModal}
                setResMsg={setResMsg}
                setStudents={setStudents}
                setSnack={setSnack}
                setSeverity={setSeverity}
                setStudentsEmpty={setStudentsEmpty}
            />

            <UpdateStudentDialog
                open={updateStudentsModal}
                onClose={setUpdateStudentsModal}
                setResMsg={setResMsg}
                setSeverity={setSeverity}
                setSnack={setSnack}
                setStudents={setStudents}
                updateStudentsId={updateStudentId}
                setUpdateStudentsId={setUpdateStudentId}
                setUpdateEmail={setUpdateEmail}
                setUpdateFname={setUpdateFname}
                setUpdateLname={setUpdateLname}
                setUpdateMname={setUpdateMname}
                setUpdatePwd={setUpdatePwd}
                updateEmail={updateEmail}
                updateFname={updateFname}
                updateLname={updateLname}
                updateMname={updateMname}
                updatePwd={updatePwd}
                disabilities={disabilities}
                setDisabilities={setDisabilities}


            />

            <SnackBar
                open={snack}
                onClose={setSnack}
                msg={resMsg}
                severity={severity}
            />

            <ConfirmationDialog
                title={`Delete Student${selectedRows.length > 1 ? 's' : ''}`}
                content="You may be deleting students data. After you delete this, it can't be recovered."
                open={deleteModal}
                setOpen={setDeleteModal}
                confirm={handleDeleteStudent}
            />
        </Box>
    )
}

export default Students;
