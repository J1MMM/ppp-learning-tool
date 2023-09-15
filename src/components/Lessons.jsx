import { Box, Button, Card, Chip, CircularProgress, Dialog, Grow, Paper, Slide, Typography } from '@mui/material';
import React, { forwardRef, useEffect, useState } from 'react';
import { Add, ChevronLeft } from '@mui/icons-material';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useData from '../hooks/useData';
import useAuth from '../hooks/useAuth';
import LessonCard from './LessonCard';
import AddLessonDialog from './AddLessonDialog';
import SnackBar from './SnackBar';
import emptyTable from '../assets/images/undraw_empty_re_opql.svg'
import NoServerResponse from './NoServerResponse';
import EditLesson from './EditLesson';
import ConfirmationDialog from './ConfirmationDialog';
import Unauthorized from './Unauthorized';
import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer';
import videoSrc from '../assets/test.mp4'

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const Lessons = () => {
    const BASE_URL = 'https://capstone-server-kqsi.onrender.com/view/'
    const axiosPrivate = useAxiosPrivate();
    const { lessons, setLessons } = useData()

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
    const [deleteFilename, setDeleteFilename] = useState("")

    useEffect(() => {
        window.scrollTo(0, 0);
        let isMounted = true;
        const controller = new AbortController();

        const getLessons = async () => {
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
                isMounted && setLessons(response.data.map(lesson => ({ ...lesson, show: true, uri: `${BASE_URL}${lesson._id}` })))
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
        setLessons(prev => prev.filter(item => item._id !== deletID))

        try {
            const res = await axiosPrivate.delete('/upload', {
                data: {
                    "id": deletID,
                    "filePath": deleteFilename
                }
            })

            setSnackMsg(res.data.message)
            setSnackSev("success")
            setSnackOpen(true)

            if (lessons.length <= 1) {
                setEmpty(true)
            }
        } catch (error) {
            setSnackMsg(error.message)
            setSnackSev("error")
            setSnackOpen(true)
            console.log(error);
        }

    }

    const handleEditLesson = (id) => {
        const card = lessons.find(item => item._id == id)
        setNewTitle(card.title)
    }

    const [activeDocs, setActiveDocs] = useState(lessons[0])
    const [openVDialog, setOpenVDialog] = useState(false)

    const handleViewFile = (index) => {
        setActiveDocs(prev => {
            return lessons[index]
        })
        setOpenVDialog(true)


    };

    const lessonsEl = lessons?.map((lesson, index) => {

        return <LessonCard
            index={index}
            key={index}
            deleteLesson={deleteLesson}
            setEditLessonOpen={setEditLessonOpen}
            setLessonToEditID={setLessonToEditID}
            handleEditLesson={handleEditLesson}
            setDeleteModal={setDeleteModal}
            setDeleteFilename={setDeleteFilename}
            setDeleteID={setDeleteID}
            handleViewFile={handleViewFile}
            show={lesson.show}
            lesson={lesson}
        />
    })
    // custom renderer 
    const MyCustomVideoRenderer = ({ mainState: { currentDocument } }) => {
        if (!currentDocument) return null;
        return (
            <video controls autoPlay width="100%" height="100%" style={{ backgroundColor: 'black' }}>
                <source src={currentDocument.fileData} type='video/mp4' />
            </video>
        );
    };
    MyCustomVideoRenderer.fileTypes = ["mp4", "video/mp4"];
    MyCustomVideoRenderer.weight = 1;

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
                sx={{
                    flexDirection: {
                        xs: "column",
                        sm: "column",
                        md: "row"
                    }
                }}
            >
                <Box sx={{ mb: { xs: 1, sm: 1, md: 0 } }} >
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
                baseURL={BASE_URL}
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
                baseURL={BASE_URL}
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
                        <Typography variant='h4' textAlign="center" color='#2F2E41'>No Lessons Found</Typography>
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
                sx={{
                    bgcolor: 'black',
                }}
            >
                <Button onClick={() => setOpenVDialog(false)} sx={{ position: 'absolute', top: "3rem", left: 0, zIndex: 10, '&:hover': { color: 'red' } }} size='large'>
                    <ChevronLeft fontSize='medium' />
                    back
                </Button>
                <DocViewer
                    pluginRenderers={[MyCustomVideoRenderer, ...DocViewerRenderers]}
                    documents={lessons}
                    activeDocument={activeDocs}
                    prefetchMethod='GET'
                    style={{ height: "100vh" }}
                    theme={{
                        primary: "#414AE0",
                        secondary: "black",
                        tertiary: "#c8cef7",
                        textPrimary: "#FFF",
                        textSecondary: "#5296d8",
                        textTertiary: "black",
                        disableThemeScrollbar: false,
                    }}
                />
            </Dialog>
        </Paper>
    );
}



export default Lessons;
