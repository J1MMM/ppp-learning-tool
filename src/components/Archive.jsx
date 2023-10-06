import { Add, FilterList } from '@mui/icons-material';
import { Box, Button, ButtonGroup, Chip, Grow, Paper, Tab, TableContainer, Tabs, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import StudentsTable from './StudentsTable';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useData from '../hooks/useData';
import StudentsArchived from './StudentsArchived';

const Archive = () => {
    const axiosPrivate = useAxiosPrivate()
    const { tabPage, setTabpage, studentsArchived, setStudentsArchived } = useData();

    const [selectedRows, setSelectedRows] = useState([])

    const [studentsEmpty, setStudentsEmpty] = useState(false)
    const [noServerRes, setNoServerRes] = useState(false)

    const [alphabetically, setAlphabetically] = useState(false)


    useEffect(() => {
        window.scrollTo(0, 0);
        let isMounted = true;
        const controller = new AbortController();

        const getStudents = async () => {
            try {
                const response = await axiosPrivate.get('/students', {
                    signal: controller.signal
                });

                const resVal = response.data.filter(v => v.archive)
                const resValLength = resVal.length

                if (resValLength == 0) {
                    setStudentsEmpty(true)
                }

                isMounted && setStudentsArchived(resVal)

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
        const sortBy = alphabetically ? 'lastname' : '_id'

        const sortedData = [...studentsArchived].sort((a, b) => {
            return a[sortBy].localeCompare(b[sortBy]);
        });

        setStudentsArchived(sortedData)

    }, [alphabetically])


    return (
        <Grow in={true}>
            <Paper elevation={3} sx={{ position: 'relative', boxSizing: 'border-box', borderRadius: 3, zIndex: 10, overflow: 'hidden' }}>
                <Box borderBottom={1} borderColor={'divider'} bgcolor={'#FFF'} >
                    <Tabs value={tabPage} onChange={(e, val) => setTabpage(val)} aria-label="tab">
                        <Tab label="Students" id='tab-1' aria-controls='tab-1' />
                        <Tab label="Lessons" id='tab-2' aria-controls='tab-2' />
                    </Tabs>
                </Box>
                <Box>
                    <Box role="tabpanel" hidden={tabPage != 0} aria-labelledby={`table-1`}>
                        <StudentsArchived
                            studentsArchived={studentsArchived}
                            selectedRows={selectedRows}
                            studentsEmpty={studentsEmpty}
                            setSelectedRows={setSelectedRows}
                            setStudentsArchived={setStudentsArchived}
                            setStudentsEmpty={setStudentsEmpty}
                            alphabetically={alphabetically}
                            setAlphabetically={setAlphabetically}
                        />
                    </Box>
                    <Box height={'50vh'} role="tabpanel" hidden={tabPage != 1} aria-labelledby={`table-2`}>

                    </Box>
                </Box>
            </Paper>

        </Grow >

    );
}

export default Archive;
