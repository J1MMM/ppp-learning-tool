import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grow, IconButton, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import InputFile from './InputFile';
import { Delete, Description } from '@mui/icons-material';
import useAxios from '../hooks/useAxios';

const EditLesson = ({ baseURI, open, onClose, disabled, setDisabled, lessonToEditID, setSnackSev, setSnackMsg, setLessons, setSnackOpen, setEmpty, lessons, newFile, newTitle, setNewFile, setNewTitle }) => {
    const axios = useAxios()


    const handleEditLesson = async (e) => {
        e.preventDefault()
        setDisabled(true)

        if (newFile) {
            const allowedExt = ['ppt', 'pptx', 'pptm', 'doc', 'docx', 'pdf', 'jpg', 'jpeg', 'png', 'txt']
            const fileExt = newFile?.name.split('.').pop().toLowerCase()

            if (!allowedExt.includes(fileExt)) {
                setSnackOpen(true)
                setSnackSev("error")
                setSnackMsg("Invalid file format.")
                setDisabled(false)
                return 0
            }
        }

        const formData = new FormData()
        formData.append('title', newTitle)
        formData.append('file', newFile)
        formData.append('id', lessonToEditID)

        try {
            const response = await axios.put('/upload', formData)
            console.log(response);
            setLessons(prev => prev?.map(lesson => {
                const fileExt = response.data.result.filename.split('.').pop().toLowerCase()

                if (lesson._id == response.data.result._id) {
                    return ({ ...response.data.result, show: true, uri: `${baseURI}${response.data.result.filename}`, fileType: fileExt, fileName: response.data.result.filename.split('_').pop() })
                } else {
                    return lesson
                }
            }))
            setSnackMsg(response?.data?.message)
            setSnackOpen(true)
            setSnackSev("success")
            setEmpty(false)
        } catch (error) {
            console.error(error);
        }

        setNewFile(null)
        setNewTitle("")
        onClose(false)
        setDisabled(false)
    }
    return (
        <Dialog open={open} onClose={() => onClose(false)} >
            <form onSubmit={handleEditLesson} style={{ minWidth: '500px', maxWidth: '500px' }}>
                <DialogTitle variant='h5' >Edit Lesson</DialogTitle>
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
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                        />

                        <InputFile file={newFile} setFile={setNewFile} />

                        {newFile && <Grow in={newFile ? true : false} >
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
                                    <Typography variant='body2' color="#FFF" ml={1}>{newFile?.name}</Typography>
                                </Box>

                                <Box
                                    display="flex"
                                    alignItems="center"
                                >
                                    <Typography variant='body2' color="#FFF" ml={1}>{(newFile?.size / 1024).toFixed(2)} KB</Typography>

                                    <IconButton onClick={() => setNewFile(null)}>
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

export default EditLesson;
