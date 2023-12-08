import { Box, Button, Divider, Grow, Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useData from '../hooks/useData';
import SnackBar from './SnackBar';

import emptyTable from '../assets/images/undraw_empty_re_opql.svg'
import ClassroomCardArchived from './ClassroomCardArchived';

function sortByDate(array, datePropertyName) {
    return array.sort((a, b) => new Date(a[datePropertyName]) - new Date(b[datePropertyName]));
}


const ClassroomArchived = () => {
    const axiosPrivate = useAxiosPrivate()
    const { classesArchived, setClassesArchived } = useData()
    const [sortedClasses, setSortedClasses] = useState([])

    const [snack, setSnack] = useState(false)
    const [severity, setSeverity] = useState('success')
    const [resMsg, setResMsg] = useState('')

    const [empty, setEmpty] = useState(false)
    const [noResponse, setNoResponse] = useState(false)

    useEffect(() => {
        if (classesArchived.length == 0) {
            setEmpty(true)
        } else {
            setEmpty(false)
        }
    }, [classesArchived])

    useEffect(() => {
        window.scrollTo(0, 0);
        let isMounted = true;
        const controller = new AbortController();

        const getClasses = async () => {
            try {
                const response = await axiosPrivate.get('/class', {
                    signal: controller.signal
                });


                if (response.data.length == 0) {
                    setEmpty(true)
                    return;
                }

                setEmpty(false)
                isMounted && setClassesArchived(response.data.filter(item => item.archive == true))
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

    useEffect(() => {
        setSortedClasses(v => sortByDate(classesArchived, 'schoolYear'))
    }, [classesArchived])

    const ClassCardsElements = sortedClasses.map((item, index) => {
        return <ClassroomCardArchived
            key={index}
            item={item}
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
                        <Typography component={'span'} variant='h5' >Archived Classes</Typography>
                    </Box>
                    <Typography component={'span'} variant='caption' color='InactiveCaptionText' >Collection of class records you have archived</Typography>
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
                            filter: 'grayscale(1)'
                        }} />
                        <Typography component={'span'} variant='h5' textAlign="center" color='#2F2E41'>None of your classes have been archived</Typography>
                    </Box>
                </Grow>
            </Box>

            <SnackBar
                open={snack}
                onClose={setSnack}
                msg={resMsg}
                severity={severity}
            />
        </Paper>
    );
}

export default ClassroomArchived;
