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
        let isMounted = true;
        const controller = new AbortController();

        const getStudents = async () => {
            console.log("get students");

            try {
                const response = await axiosPrivate.get('/students', {
                    signal: controller.signal
                });

                if (response.data?.length == 0) {
                    setStudentsEmpty(true)
                }
                isMounted && setStudents(response.data)

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
                data: {
                    "id": deleteStudentId
                }
            })
            setStudents(prev => prev.filter(user => user._id !== deleteStudentId))
            if (students.length <= 1) {
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
                setAddStudentModal={setAddStudentsModal}
                setDeleteStudentId={setDeleteStudentId}
                setDeleteModal={setDeleteModal}
                setUpateStudentModal={setUpdateStudentsModal}
                geStudent={getStudent}
                studentsEmpty={studentsEmpty}
                noServerRes={noServerRes}
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
                title="Delete Student"
                content="Are you sure to delete this student?"
                open={deleteModal}
                setOpen={setDeleteModal}
                confirm={handleDeleteStudent}
            />
        </Box>
    )
}

export default Students;
