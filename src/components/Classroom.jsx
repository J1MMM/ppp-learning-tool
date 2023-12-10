import { Add } from '@mui/icons-material';
import { Box, Button, Divider, Grow, Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { NavLink, Navigate, Outlet, useNavigate } from 'react-router-dom';
import ClassroomCard from './ClassroomCard';
import CreateClassModal from './CreateClassModal';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useData from '../hooks/useData';
import SnackBar from './SnackBar';

import emptyTable from '../assets/images/undraw_empty_re_opql.svg'
import EditClassModal from './EditClassModal';

function sortByDate(array, datePropertyName) {
    return array.sort((a, b) => new Date(a[datePropertyName]) - new Date(b[datePropertyName]));
}

const Classroom = () => {
    const axiosPrivate = useAxiosPrivate()
    const { classes, setClasses, setStudents, setStudentsArchived, setLessons } = useData()
    const [sortedClasses, setSortedClasses] = useState([])
    const [createClassModal, setCreateClassModal] = useState(false)
    const [editClassModal, setEditClassModal] = useState(false)

    const [idToUpdate, setIdToUpdate] = useState("")
    const [updatedSection, setUpdatedSection] = useState("")
    const [updatedGradeLevel, setUpdatedGradeLevel] = useState(1)
    const [updatedSchoolYear, setUpdatedSchoolYear] = useState(new Date())

    const [section, setSection] = useState("")
    const [gradeLevel, setGradeLevel] = useState(1)
    const [schoolYear, setSchoolYear] = useState(new Date())

    const [snack, setSnack] = useState(false)
    const [severity, setSeverity] = useState('success')
    const [resMsg, setResMsg] = useState('')

    const [empty, setEmpty] = useState(false)
    const [noResponse, setNoResponse] = useState(false)

    useEffect(() => {
        if (classes.length == 0) {
            setEmpty(true)
        } else {
            setEmpty(false)
        }
    }, [classes])

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = "Class Management"
        let isMounted = true;
        const controller = new AbortController();

        const getClasses = async () => {
            try {
                const response = await axiosPrivate.get('/class', {
                    signal: controller.signal
                });

                isMounted && setClasses(response.data.filter(item => item.archive == false))
            } catch (err) {
                setNoResponse(true)
            }
        }

        getClasses()

        return () => {
            isMounted = false;
            isMounted && controller.abort();
        }
    }, [])

    // useEffect(() => {
    //     setSortedClasses(v => sortByDate(classes, 'schoolYear'))

    // }, [classes])

    const ClassCardsElements = classes.map((item, index) => {
        return <ClassroomCard
            key={index}
            item={item}
            setEditClassModal={setEditClassModal}
            setIdToUpdate={setIdToUpdate}
            setUpdatedGradeLevel={setUpdatedGradeLevel}
            setUpdatedSchoolYear={setUpdatedSchoolYear}
            setUpdatedSection={setUpdatedSection}
            setResMsg={setResMsg}
            setSeverity={setSeverity}
            setSnack={setSnack}
        />
    })

    return (
        <Paper
            elevation={0}
            sx={{
                p: 2,
                borderRadius: 3,
                minHeight: '80vh',
                position: 'relative'

            }}
        >
            <Box
                bgcolor='#fff'
                display='flex'
                justifyContent='space-between'
                pb={1}
                boxSizing='border-box'
                zIndex='99'
                sx={{
                    flexDirection: {
                        xs: "column",
                        sm: "column",
                        md: "row"
                    },
                    mb: {
                        xs: 0,
                        sm: 0,
                        md: 2
                    }
                }}
            >
                <Box sx={{ mb: { xs: 1, sm: 1, md: 0 } }} >
                    <Box display='flex' alignItems='center' gap={1} mb={-.5}>
                        <Typography component={'span'} variant='h5' >Class Management</Typography>
                    </Box>
                    <Typography component={'span'} variant='caption' color='InactiveCaptionText' >Manage Your Class Efficiently.</Typography>
                </Box>

                <Box display='flex' alignItems='center' gap={2} sx={{ mb: { xs: 2, sm: 2, md: 0 } }}>

                    <Button
                        variant='contained'
                        size='small'
                        onClick={() => setCreateClassModal(true)}
                        disableFocusRipple
                    >
                        <Add sx={{ color: '#FFF' }} />
                        <Typography component={'span'} pr={1} variant='caption' color="#FFF">
                            Create Class
                        </Typography>
                    </Button>
                </Box>
            </Box>

            <Box
                display="flex"
                gap={3}
                flexWrap="wrap"
            >
                {ClassCardsElements}
                <Grow in={empty}>
                    <Box
                        display='flex'
                        justifyContent="center"
                        alignItems="center"
                        flexDirection="column"
                        gap={2}
                        boxSizing='border-box'
                        height="50vh"
                        position={'absolute'}
                        left={'50%'}
                        sx={{
                            translate: '-50%'
                        }}
                    >
                        <img src={emptyTable} style={{
                            width: '100%',
                            maxWidth: '16rem',
                        }} />
                        <Typography component={'span'} variant='h5' textAlign="center" color='#2F2E41'>Add a class to get started</Typography>


                        <Button
                            variant='text'
                            size='small'
                            onClick={() => setCreateClassModal(true)}
                        >
                            <Add sx={{ color: 'primary.main' }} />
                            <Typography component={'span'} pr={1} variant='caption' color="primary.main" fontWeight={500}>
                                Create Class
                            </Typography>
                        </Button>
                    </Box>
                </Grow>
            </Box>

            <CreateClassModal
                open={createClassModal}
                onClose={setCreateClassModal}
                schoolYear={schoolYear}
                setSchoolYear={setSchoolYear}
                gradeLevel={gradeLevel}
                setGradeLevel={setGradeLevel}
                section={section}
                setSection={setSection}
                setResMsg={setResMsg}
                setSeverity={setSeverity}
                setSnack={setSnack}
            />

            <EditClassModal
                open={editClassModal}
                onClose={setEditClassModal}
                idToUpdate={idToUpdate}
                setResMsg={setResMsg}
                setSeverity={setSeverity}
                setSnack={setSnack}
                setUpdatedGradeLevel={setUpdatedGradeLevel}
                setUpdatedSchoolYear={setUpdatedSchoolYear}
                setUpdatedSection={setUpdatedSection}
                updatedGradeLevel={updatedGradeLevel}
                updatedSchoolYear={updatedSchoolYear}
                updatedSection={updatedSection}
            />

            <SnackBar
                open={snack}
                onClose={setSnack}
                msg={resMsg}
                severity={severity}
            />
        </Paper>
    );
}

export default Classroom;
