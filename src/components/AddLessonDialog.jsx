import { Box, Button, CircularProgress, Collapse, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grow, IconButton, Popover, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import useAxios from '../hooks/useAxios';
import { CloudDownload, CloudUpload, Delete, Description, Done, DownloadDone, FileDownloadDone, FileUpload, FileUploadOutlined, Folder, InsertDriveFile, InsertDriveFileOutlined, UploadFile } from '@mui/icons-material';
import InputFile from './InputFile';

const AddLessonDialog = ({ baseURL, open, onClose, disabled, setDisabled, setLessons, setSnackMsg, setSnackOpen, setSnackSev, snackSev, snackOpen, snackMsg, setEmpty, }) => {
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
            console.log(response);
            const newData = ({ ...response.data.result, show: true, uri: `${baseURL}${response.data.result._id}` })

            setLessons(prev => ([...prev, newData]))
            setSnackMsg(response.data.message)
            setSnackOpen(true)
            setSnackSev("success")
            setEmpty(false)
        } catch (error) {
            setSnackOpen(true)
            setSnackSev("error")
            setSnackMsg(error?.message)
            setDisabled(false)
            console.error(error);
        }

        setFile(null)
        setTitle("")
        onClose(false)
        setDisabled(false)
    }

    return (
        <Dialog open={open} onClose={() => onClose(false)} >
            <Box
                sx={{
                    minWidth: {
                        md: "500px"
                    }
                }}
            >

                <form onSubmit={handleAddLesson} style={{ width: "100%" }}>
                    <DialogTitle variant='h5' >Add Lesson</DialogTitle>
                    <Divider />
                    <DialogContent>
                        <Box
                            display="flex"
                            flexDirection="column"
                            gap={2}
                        >
                            <TextField
                                disabled={disabled}
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
                            <InputFile file={file} setFile={setFile} disabled={disabled} />

                            {file && <Grow in={file ? true : false} >
                                <Box
                                    width="100%"
                                    p={1}
                                    boxSizing="border-box"
                                    bgcolor={disabled ? "InactiveCaptionText" : "primary.main"}
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

                                        <IconButton disabled={disabled} onClick={() => !disabled && setFile(null)}>
                                            <Delete color='common' />
                                        </IconButton>
                                    </Box>
                                </Box>
                            </Grow>}

                        </Box>
                    </DialogContent>

                    <DialogActions>
                        <Button disabled={disabled} onClick={() => onClose(false)} color='inherit' sx={{ mt: -2 }}><Typography>Cancel</Typography></Button>
                        <Button type='submit' disabled={disabled} sx={{ mr: 1, mt: -2 }}>{disabled && <CircularProgress size={16} color='inherit' />} <Typography ml={1}>Submit</Typography></Button>
                    </DialogActions>
                </form>
            </Box>
        </Dialog >
    );
}

export default AddLessonDialog;
