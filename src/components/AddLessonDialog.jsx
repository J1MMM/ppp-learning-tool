import { Box, Button, Collapse, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grow, IconButton, Popover, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import useAxios from '../hooks/useAxios';
import { CloudDownload, CloudUpload, Delete, Description, Done, DownloadDone, FileDownloadDone, FileUpload, FileUploadOutlined, Folder, InsertDriveFile, InsertDriveFileOutlined, UploadFile } from '@mui/icons-material';
import InputFile from './InputFile';

const AddLessonDialog = ({ baseURI, open, onClose, disabled, setDisabled, setLessons, setSnackMsg, setSnackOpen, setSnackSev, snackSev, snackOpen, snackMsg, setEmpty }) => {
    const axios = useAxios();

    const [title, setTitle] = useState("")
    const [file, setFile] = useState(null)


    const handleAddLesson = async (e) => {
        e.preventDefault()
        setDisabled(true)

        if (!title || !file) {
            setSnackOpen(true)
            setSnackSev("error")
            setSnackMsg("All fields are required")
            setDisabled(false)
            return null
        }

        const allowedExt = ['ppt', 'pptx', 'pptm', 'doc', 'docx', 'pdf', 'jpg', 'jpeg', 'png', 'txt']
        const fileExt = file.name.split('.').pop().toLowerCase()
        if (!allowedExt.includes(fileExt)) {
            setSnackOpen(true)
            setSnackSev("error")
            setSnackMsg("Invalid file format.")
            setDisabled(false)
            return 0
        }

        const formData = new FormData()
        formData.append('title', title)
        formData.append('file', file)

        try {
            const response = await axios.post('/upload', formData)

            const fileExt = response.data.result.filename.split('.').pop().toLowerCase()
            const fileName = response.data.result.filename.split('_').pop()
            const newData = ({ ...response.data.result, show: true, uri: `${baseURI}${response.data.result.filename}`, fileType: fileExt, fileName: fileName })

            setLessons(prev => ([...prev, newData]))
            setSnackMsg(response.data.message)
            setSnackOpen(true)
            setSnackSev("success")
            setEmpty(false)
        } catch (error) {
            console.error(error);
        }

        setFile(null)
        setTitle("")
        onClose(false)
        setDisabled(false)
    }

    return (
        <Dialog open={open} onClose={() => onClose(false)} >
            <form onSubmit={handleAddLesson} style={{ minWidth: '500px', maxWidth: '500px' }}>
                <DialogTitle variant='h5' >Add Lesson</DialogTitle>
                <Divider />
                <DialogContent>
                    <Box
                        display="flex"
                        flexDirection="column"
                        gap={2}
                    >
                        <TextField
                            autoFocus
                            margin="dense"
                            id="title"
                            label="Lesson Title"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        {/* input file */}
                        <InputFile file={file} setFile={setFile} />

                        {file && <Grow in={file ? true : false} >
                            <Box
                                width="100%"
                                p={1}
                                boxSizing="border-box"
                                bgcolor="primary.main"
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                borderRadius={1}
                            >
                                <Box
                                    display="flex"
                                    alignItems="center"
                                    maxWidth="280px"
                                    overflow="hidden"
                                >
                                    <Description color='common' />
                                    <Typography variant='body2' color="#FFF" ml={1}>{file?.name}</Typography>
                                </Box>

                                <Box
                                    display="flex"
                                    alignItems="center"
                                >
                                    <Typography variant='body2' color="#FFF" ml={1}>{(file?.size / 1024).toFixed(2)} KB</Typography>

                                    <IconButton onClick={() => setFile(null)}>
                                        <Delete color='common' />
                                    </IconButton>
                                </Box>
                            </Box>
                        </Grow>}

                    </Box>
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => onClose(false)} color='inherit'>Cancel</Button>
                    <Button type='submit' disabled={disabled}>Submit</Button>
                </DialogActions>
            </form>



        </Dialog >
    );
}

export default AddLessonDialog;
