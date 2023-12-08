import { Add, FilterList } from '@mui/icons-material';
import { Box, Button, ButtonGroup, Chip, Grow, Paper, Tab, TableContainer, Tabs, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import StudentsTable from './StudentsTable';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useData from '../hooks/useData';
import StudentsArchived from './StudentsArchived';
import Lessons from './Lessons';
import LessonsArchive from './LessonsArchive';
import { useParams } from 'react-router-dom';

const Archive = () => {
    const { id } = useParams()
    const axiosPrivate = useAxiosPrivate()
    const { archiveMode, studentsArchived, setStudentsArchived } = useData();

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
                const response = await axiosPrivate.get(`/students/${id}`, {
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
            <Paper elevation={3} sx={{ position: 'relative', boxSizing: 'border-box', borderRadius: 3, zIndex: 10, overflow: 'hidden', filter: archiveMode ? 'grayscale(1)' : '' }}>
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
            </Paper>
        </Grow >

    );
}

export default Archive;
