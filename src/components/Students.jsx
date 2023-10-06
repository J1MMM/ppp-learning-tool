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
import StudentMoreInfo from './StudentMoreInfo';
import { differenceInMonths, differenceInYears } from 'date-fns'

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
    const [updateGender, setUpdateGender] = useState("")
    const [updateGuardian, setUpdateGuardian] = useState("")
    const [updateAddress, setUpdateAddress] = useState("")
    const [updateContactNo, setUpdateContactNo] = useState("")
    const [updateDateOfBirth, setUpdateDateOfBirth] = useState(null)
    const [age, setAge] = useState("")
    const [updateAge, setUpdateAge] = useState("")

    const [alphabetically, setAlphabetically] = useState(false)

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

                if (response.data.filter(student => student.archive == false).length == 0) {
                    setStudentsEmpty(true)
                }

                isMounted && setStudents(response.data.filter(student => student.archive == false))

            } catch (err) {
                setNoServerRes(true)
                console.error(err);
            }
        }

        getStudents();

        return () => {
            isMounted = false;
            isMounted && controller.abort();
        }
    }, [])

    useEffect(() => {
        if (students.filter(student => student.archive == false).length > 0) {
            setStudentsEmpty(false)
        }
    }, [students])

    const handleDeleteStudent = async () => {
        try {
            const response = await axiosPrivate.patch('/students', { "idsToDelete": selectedRows, "toAchive": true })

            // setStudents(prev => prev.filter(user => !selectedRows.includes(user._id)))
            setStudents(response.data.filter(student => student.archive == false))
            setResMsg('Student archived successfully')
            setSeverity("success")
            setSnack(true)
            if (response.data.filter(student => student.archive == false).length == 0) {
                setStudentsEmpty(true)
            }

        } catch (error) {
            console.error(error.response.data.message);
            setResMsg('Failed to achive')
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
        setUpdatePwd("")
        setUpdateGender("")
        setUpdateGuardian("")
        setUpdateAddress("")
        setUpdateContactNo("")
        setUpdateDateOfBirth(null)
        setUpdateAge("")
        try {
            const response = await axiosPrivate(`/students/${id}`)
            const parseDate = new Date(response?.data?.birthday)

            setUpdateStudentId(response?.data?._id)
            setUpdateFname(response?.data?.firstname)
            setUpdateLname(response?.data?.lastname)
            setUpdateMname(response?.data?.middlename)
            setUpdateEmail(response?.data?.email)
            setUpdateGender(response?.data?.gender)
            setUpdateAddress(response?.data?.address)
            setUpdateGuardian(response?.data?.guardian)
            setUpdateContactNo(response?.data?.contactNo)
            setUpdateDateOfBirth(parseDate)

            // compute age 
            const currentDate = new Date();
            const ageInYears = differenceInYears(currentDate, parseDate);

            setUpdateAge(`${ageInYears} years old`)


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

    useEffect(() => {
        const sortBy = alphabetically ? 'lastname' : '_id'

        const sortedData = [...students].sort((a, b) => {
            return a[sortBy].localeCompare(b[sortBy]);
        });

        setStudents(sortedData)

    }, [alphabetically])

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
                setAlphabetically={setAlphabetically}
                alphabetically={alphabetically}
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
                setUpdateAddress={setUpdateAddress}
                setUpdateContactNo={setUpdateContactNo}
                setUpdateDateOfBirth={setUpdateDateOfBirth}
                setUpdateGender={setUpdateGender}
                setUpdateGuardian={setUpdateGuardian}
                updateAddress={updateAddress}
                updateContactNo={updateContactNo}
                updateDateOfBirth={updateDateOfBirth}
                updateGender={updateGender}
                updateGuardian={updateGuardian}
                updateAge={updateAge}
                setUpdateAge={setUpdateAge}
                setAlphabetically={setAlphabetically}
            />

            <SnackBar
                open={snack}
                onClose={setSnack}
                msg={resMsg}
                severity={severity}
            />

            <ConfirmationDialog
                title={`Archive Student${selectedRows.length > 1 ? 's' : ''}`}
                content={`Are you sure you want to archive this student${selectedRows.length > 1 ? 's' : ''} data?`}
                open={deleteModal}
                setOpen={setDeleteModal}
                confirm={handleDeleteStudent}
            />

        </Box>
    )
}

export default Students;
