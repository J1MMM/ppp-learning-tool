import { Box, Button, Checkbox, CircularProgress, Collapse, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, Grow, IconButton, InputLabel, List, ListItem, ListItemText, MenuItem, OutlinedInput, Popover, Select, TextField, Tooltip, Typography } from '@mui/material';
import React, { useState } from 'react';
import useAxios from '../hooks/useAxios';
import { Delete, Description, Help } from '@mui/icons-material';
import InputFile from './InputFile';
import { useParams } from 'react-router-dom';

const AddLessonDialog = ({ baseURL, open, onClose, disabled, setDisabled, setLessons, setSnackMsg, setSnackOpen, setSnackSev, snackSev, snackOpen, snackMsg, setEmpty, setFilter }) => {
    const axios = useAxios();
    const { id } = useParams()

    const [anchorEl, setAnchorEl] = useState(null);
    const [title, setTitle] = useState("")
    const [categories, setCategories] = useState([])
    const [file, setFile] = useState(null)

    const items = ['Dyslexia', 'Dysgraphia', 'Dyscalculia']



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

        const allowedExt = ['ppt', 'pptx', 'pptm', 'doc', 'docx', 'pdf', 'jpg', 'jpeg', 'png', 'txt', 'mp4']
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
        formData.append('categories', categories)
        formData.append('classID', id)

        try {
            const response = await axios.post('/upload', formData)
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
        setCategories([])
        setFilter([])
        onClose(false)
        setDisabled(false)
    }

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setCategories(
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    return (
        <Dialog open={open} onClose={() => onClose(false)} >
            <Box
                maxWidth='500px'
                sx={{
                    minWidth: {
                        md: "500px"
                    }
                }}

            >
                <form onSubmit={handleAddLesson} style={{ width: "100%" }}>
                    <DialogTitle variant='h5' bgcolor="primary.main" color="#FFF">Add Lesson</DialogTitle>
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
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                                <FormControl variant="outlined" fullWidth margin='dense'>
                                    <InputLabel id="demo-multiple-name-label">Learning Support</InputLabel>
                                    <Select
                                        labelId="demo-multiple-name-label"
                                        id="demo-multiple-name"
                                        multiple
                                        value={categories}
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
                                                <Checkbox checked={categories.indexOf(name) > -1} />
                                                <ListItemText primary={name} />
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>
                            {/* input file */}
                            <InputFile file={file} setFile={setFile} disabled={disabled} />
                            <Box display={'flex'} gap={1} alignItems={'center'}>
                                <Help fontSize='small' color='disabled' onMouseEnter={(e) => setAnchorEl(e.currentTarget)} onMouseLeave={() => setAnchorEl(null)} />
                                <Typography fontSize='small' color='InactiveCaptionText'>Accepted File Formats</Typography>
                            </Box>

                            <Popover
                                id="mouse-over-popover"
                                sx={{
                                    pointerEvents: 'none',
                                }}
                                open={Boolean(anchorEl)}
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                transformOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                onClose={() => setAnchorEl(null)}
                                disableRestoreFocus

                            >
                                <Box p={2}>
                                    <Typography variant='subtitle1' fontWeight={'700'}>We accept the following files, under 100MB size:</Typography>
                                    <ul style={{ margin: 0 }}>
                                        <li>
                                            <Typography variant='subtitle2'><strong>Documents:</strong> .doc, .docx, .pdf, .txt</Typography>
                                        </li>
                                        <li>
                                            <Typography variant='subtitle2'><strong>Presentations:</strong> .ppt, .pptx, .pptm</Typography>
                                        </li>
                                        <li>
                                            <Typography variant='subtitle2'><strong>Images:</strong> .jpg, .jpeg, .png</Typography>
                                        </li>
                                        <li>
                                            <Typography variant='subtitle2'><strong>Videos:</strong> .mp4</Typography>
                                        </li>
                                    </ul>
                                </Box>
                            </Popover>

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
                                        <Typography component={'span'} variant='body2' color="#FFF" ml={1} sx={{ fontSize: { xs: 10, sm: 14 }, maxWidth: { xs: "5rem", sm: "none" } }}>{file?.name}</Typography>
                                    </Box>

                                    <Box
                                        display="flex"
                                        alignItems="center"
                                    >
                                        <Typography component={'span'} variant='body2' color="#FFF" ml={1} sx={{ fontSize: { xs: 10, sm: 14 } }}>{(file?.size / 1024).toFixed(2)} KB</Typography>

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
                        <Button type='submit' disabled={disabled} sx={{ mr: 1, mt: -2 }}>{disabled && <CircularProgress size={16} color='inherit' />} <Typography component={'span'} ml={1}>Submit</Typography></Button>
                    </DialogActions>
                </form>
            </Box>
        </Dialog >
    );
}

export default AddLessonDialog;
