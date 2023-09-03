import { Box, Button, Card, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grow, IconButton, Paper, Slide, TextField, Typography } from '@mui/material';
import React, { forwardRef, useEffect, useState } from 'react';
import useAxios from '../hooks/useAxios';
import { Add, ArrowBack, ArrowBackIosNewRounded, ArrowBackIosNewSharp, Download, DownloadOutlined, FileOpen, Folder, FolderOutlined, MoreVert } from '@mui/icons-material';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useData from '../hooks/useData';
import useAuth from '../hooks/useAuth';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LessonCard from './LessonCard';
import AddLessonDialog from './AddLessonDialog';
import SnackBar from './SnackBar';
import emptyTable from '../assets/images/undraw_empty_re_opql.svg'
import NoServerResponse from './NoServerResponse';
import EditLesson from './EditLesson';
import ConfirmationDialog from './ConfirmationDialog';
import Unauthorized from './Unauthorized';

import banner1 from '../assets/images/banner1.webp'
import banner2 from '../assets/images/banner2.svg'
import banner3 from '../assets/images/banner3.jpg'
import banner4 from '../assets/images/banner4.jpg'
import banner5 from '../assets/images/banner5.jpg'
import banner6 from '../assets/images/banner6.jpg'
import banner7 from '../assets/images/banner7.jpg'
import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer';

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


const Lessons = () => {
    const axiosPrivate = useAxiosPrivate();
    const { lessons, setLessons } = useData()
    const { auth } = useAuth()

    const [addLessonOpen, setAddLessonOpen] = useState(false)
    const [submitDisabled, setSubmitDisabled] = useState(false)
    const [empty, setEmpty] = useState(false)
    const [noResponse, setNoResponse] = useState(false)
    const [unAuthorized, setUnAuthorized] = useState(false)

    const [lessonToEditID, setLessonToEditID] = useState("")
    const [editLessonOpen, setEditLessonOpen] = useState(false)
    const [editLessonFormSubmitDisabled, setEditLessonFormSubmitDisabled] = useState(false)

    const [snackOpen, setSnackOpen] = useState(false)
    const [snackMsg, setSnackMsg] = useState("")
    const [snackSev, setSnackSev] = useState("success")

    const [newTitle, setNewTitle] = useState("")
    const [newFile, setNewFile] = useState(null)

    const [deleteModal, setDeleteModal] = useState(false)
    const [deletID, setDeleteID] = useState("")
    const [deletFilename, setDeleteFilename] = useState("")



    useEffect(() => {
        window.scrollTo(0, 0);
        let isMounted = true;
        const controller = new AbortController();

        const getLessons = async () => {
            console.log("get Lessons");
            try {
                const response = await axiosPrivate.get('/upload', {
                    signal: controller.signal
                });
                setNoResponse(false)
                if (response.data.length == 0) {
                    setEmpty(true)
                    return null;
                }
                setEmpty(false)
                isMounted && setLessons(response.data.map(data => ({ ...data, show: true })))
            } catch (err) {
                if (err.response.status === 401) {
                    setUnAuthorized(true)
                } else {
                    setNoResponse(true)
                }
            }
        }
        if (lessons.length == 0) {
            getLessons()
        }
        return () => {
            isMounted = false;
            isMounted && controller.abort();
        }
    }, [])

    const deleteLesson = async () => {
        setLessons(prev => prev.map(data => (data._id == deletID ? { ...data, show: false } : data)))

        try {
            const res = await axiosPrivate.delete('/upload', {
                data: {
                    "id": deletID,
                    "filename": deletFilename
                }
            })
            console.log(res);

            setLessons(prev => prev.filter(item => item._id !== deletID))
            console.log(lessons);

            if (lessons.length <= 1) {
                setEmpty(true)
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleEditLesson = (id) => {
        const card = lessons.find(item => item._id == id)
        setNewTitle(card.title)
    }

    const docs = [];
    const [activeDocs, setActiveDocs] = useState(docs[0])
    const [openVDialog, setOpenVDialog] = useState(false)

    const handleViewFile = (filename, index) => {
        console.log(docs[index]);
        setActiveDocs(docs[index])
        setOpenVDialog(true)
    };

    const lessonsEl = lessons?.map((lesson, index) => {
        const fileExt = lesson.filename.split('.').pop().toLowerCase()
        // docs.push({ uri: `https://capstone-server-kqsi.onrender.com/view/${lesson.filename}`, fileType: fileExt, fileName: lesson.filename.split('_').pop() })
        docs.push({ uri: `http://localhost:3500/view/${lesson.filename}`, fileType: fileExt, fileName: lesson.filename.split('_').pop() })
        // setDocs(prev => [...prev, { uri: `http://localhost:3500/view/${lesson.filename}`, fileType: fileExt, fileName: lesson.filename.split('_').pop() }])

        return <LessonCard
            index={index}
            key={index}
            id={lesson._id}
            title={lesson.title}
            filename={lesson.filename}
            fullname={lesson.instructor}
            img={banner1}
            deleteLesson={deleteLesson}
            setEditLessonOpen={setEditLessonOpen}
            setLessonToEditID={setLessonToEditID}
            handleEditLesson={handleEditLesson}
            setDeleteModal={setDeleteModal}
            setDeleteFilename={setDeleteFilename}
            setDeleteID={setDeleteID}
            docs={docs}
            handleViewFile={handleViewFile}
            show={lesson.show}
        />
    })


    if (noResponse) return <NoServerResponse show={noResponse} />;
    if (unAuthorized) return <Unauthorized show={unAuthorized} />;

    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                borderRadius: 3,
                minHeight: '50vh'
            }}
        >
            <Box
                bgcolor='#fff'
                display='flex'
                justifyContent='space-between'
                pb={1}
                boxSizing='border-box'
                zIndex='99'
            >
                <Box>
                    <Box display='flex' alignItems='center' gap={1} mb={-.5}>
                        <Typography variant='h5' >Lessons Management</Typography>
                        <Chip label={`${lessons.length == 0 ? 'Empty' : lessons.length > 1 ? `${lessons.length} Lessons` : `${lessons.length} Lesson`}`} sx={{ fontFamily: 'Poppins, sans-serif', color: 'primary.main' }} size='small' />
                    </Box>
                    <Typography variant='caption' color='InactiveCaptionText' >Manage Your Lessons Efficiently.</Typography>
                </Box>

                <Button
                    variant='contained'
                    size='small'
                    onClick={() => setAddLessonOpen(true)}
                    sx={{ mb: 2 }}
                >
                    <Add />
                    <Typography pr={1} variant='button'>
                        Add Lesson
                    </Typography>
                </Button>
            </Box>
            <Box
                display="flex"
                gap={3}
                flexWrap="wrap"
            >
                {lessonsEl}
            </Box>

            <AddLessonDialog
                disabled={submitDisabled}
                setDisabled={setSubmitDisabled}
                open={addLessonOpen}
                onClose={setAddLessonOpen}
                setLessons={setLessons}
                setSnackMsg={setSnackMsg}
                setSnackOpen={setSnackOpen}
                setSnackSev={setSnackSev}
                snackMsg={snackMsg}
                snackOpen={snackOpen}
                snackSev={snackSev}
                setEmpty={setEmpty}

            />

            <EditLesson
                open={editLessonOpen}
                onClose={setEditLessonOpen}
                disabled={editLessonFormSubmitDisabled}
                setDisabled={setEditLessonFormSubmitDisabled}
                lessonToEditID={lessonToEditID}
                setLessons={setLessons}
                setSnackMsg={setSnackMsg}
                setSnackSev={setSnackSev}
                setSnackOpen={setSnackOpen}
                setEmpty={setEmpty}
                lessons={lessons}
                newFile={newFile}
                setNewFile={setNewFile}
                newTitle={newTitle}
                setNewTitle={setNewTitle}
            />

            <SnackBar
                msg={snackMsg}
                open={snackOpen}
                onClose={setSnackOpen}
                severity={snackSev}
            />

            <ConfirmationDialog
                confirm={deleteLesson}
                title="Delete File"
                content="Are you sure to delete this file?"
                open={deleteModal}
                setOpen={setDeleteModal}

            />

            {empty &&
                <Grow in={empty}>
                    <Box
                        display='flex'
                        justifyContent="center"
                        alignItems="center"
                        flexDirection="column"
                        gap={2}
                        margin={5}
                        boxSizing='border-box'
                    >
                        <img src={emptyTable} style={{
                            maxWidth: '25rem'
                        }} />
                        <Typography variant='h4' color='#2F2E41'>No Lessons Found</Typography>
                    </Box>
                </Grow>
            }

            {lessons.length < 1 && !empty &&
                <Box
                    width="100%"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    boxSizing="border-box"
                    height="50vh"
                >
                    <CircularProgress />
                </Box>
            }

            <Dialog
                fullScreen
                open={openVDialog}
                onClose={() => setOpenVDialog(false)}
                TransitionComponent={Transition}
            >
                <Box>
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                    >

                        <Button onClick={() => setOpenVDialog(false)}><ArrowBackIosNewRounded sx={{ mr: 1 }} /> Back</Button>
                        <Typography variant='h6' mr={5} color="primary.main">File Preview</Typography>
                    </Box>
                    <DocViewer
                        documents={docs}
                        activeDocument={activeDocs}
                        pluginRenderers={DocViewerRenderers}
                        style={{ height: "100%" }}
                        theme={{
                            primary: "#414AE0",
                            secondary: "black",
                            tertiary: "#c8cef7",
                            textPrimary: "#FFF",
                            textSecondary: "#5296d8",
                            textTertiary: "red",
                            disableThemeScrollbar: false,
                        }}
                    />
                </Box>
            </Dialog>

        </Paper>
    );
}



export default Lessons;
