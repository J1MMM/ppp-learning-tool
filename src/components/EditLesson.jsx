import { Box, Button, Checkbox, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, Grow, IconButton, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import InputFile from './InputFile';
import { Delete, Description } from '@mui/icons-material';
import useAxios from '../hooks/useAxios';

const EditLesson = ({ baseURL, open, onClose, disabled, setDisabled, lessonToEditID, setSnackSev, setSnackMsg, setLessons, setSnackOpen, setEmpty, lessons, newFile, newTitle, setNewFile, setNewTitle, newCategories, setNewCategories, setFilter }) => {
    const axios = useAxios()

    const items = ['Dyslexia', 'Dysgraphia', 'Dyscalculia']

    const handleEditLesson = async (e) => {
        e.preventDefault()
        setDisabled(true)

        if (newFile) {
            const allowedExt = ['ppt', 'pptx', 'pptm', 'doc', 'docx', 'pdf', 'jpg', 'jpeg', 'png', 'txt', 'mp4']
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
        formData.append('categories', newCategories)

        try {
            const response = await axios.put('/upload', formData)
            console.log(response);
            setLessons(prev => prev?.map(lesson => {
                if (lesson._id == response.data.result._id) {
                    return { ...response.data.result, show: true, uri: `${baseURL}${response.data.result._id}` }
                } else {
                    return lesson
                }
            }))
            setSnackMsg(response?.data?.message)
            setSnackOpen(true)
            setSnackSev("success")
            setEmpty(false)
        } catch (error) {
            setSnackMsg(error?.message)
            setSnackOpen(true)
            setSnackSev("error")
            console.error(error);
        }

        setNewFile(null)
        setNewTitle("")
        setNewCategories([])
        setFilter([])
        onClose(false)
        setDisabled(false)
    }

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setNewCategories(
            typeof value === 'string' ? value.split(',') : value,
        );
    };
    return (
        <Dialog open={open} onClose={() => onClose(false)} >
            <Box sx={{ minWidth: { md: "500px" } }} maxWidth="500px">
                <form onSubmit={handleEditLesson} style={{ width: "100%" }}>
                    <DialogTitle variant='h5' >Edit Lesson</DialogTitle>
                    <Divider />
                    <DialogContent>
                        <Box
                            display="flex"
                            flexDirection="column"
                            gap={2}
                        >
                            <Box
                                display="flex"
                                gap={2}
                                sx={{
                                    flexDirection: {
                                        xs: "column",
                                        sm: "row"
                                    }
                                }}

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
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                />

                                <FormControl variant="outlined" fullWidth margin='dense'>
                                    <InputLabel id="demo-multiple-name-label">Learning Support</InputLabel>
                                    <Select
                                        labelId="demo-multiple-name-label"
                                        id="demo-multiple-name"
                                        multiple
                                        value={newCategories}
                                        onChange={handleChange}
                                        input={<OutlinedInput label="Learning Support" />}
                                        renderValue={(selected) => selected.join(', ')}
                                        disabled={disabled}
                                        required
                                    >
                                        {items.map((name) => (
                                            <MenuItem
                                                key={name}
                                                value={name}
                                            >
                                                <Checkbox checked={newCategories.indexOf(name) > -1} />
                                                <ListItemText primary={name} />
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                            </Box>

                            <InputFile file={newFile} setFile={setNewFile} disabled={disabled} />

                            {newFile && <Grow in={newFile ? true : false} >
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
                                        <Typography component={'span'} variant='body2' color="#FFF" ml={1} sx={{ fontSize: { xs: 10, sm: 14 }, maxWidth: { xs: "5rem", sm: "none" } }}>{newFile?.name}</Typography>
                                    </Box>

                                    <Box
                                        display="flex"
                                        alignItems="center"
                                    >
                                        <Typography component={'span'} variant='body2' color="#FFF" ml={1} sx={{ fontSize: { xs: 10, sm: 14 }, maxWidth: { xs: "5rem", sm: "none" } }}>{(newFile?.size / 1024).toFixed(2)} KB</Typography>

                                        <IconButton disabled={disabled} onClick={() => setNewFile(null)}>
                                            <Delete color='common' />
                                        </IconButton>
                                    </Box>
                                </Box>
                            </Grow>}
                        </Box>
                    </DialogContent>

                    <DialogActions>
                        <Button disabled={disabled} onClick={() => onClose(false)} color='inherit' sx={{ mb: 1 }}><Typography>Cancel</Typography></Button>
                        <Button type='submit' disabled={disabled} sx={{ mr: 1, mb: 1 }}>{disabled && <CircularProgress size={16} color='inherit' />} <Typography component={'span'} ml={1}>save</Typography></Button>
                    </DialogActions>
                </form>
            </Box>
        </Dialog >
    );
}

export default EditLesson;
