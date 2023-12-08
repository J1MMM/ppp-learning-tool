import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import React, { useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useData from '../hooks/useData';

const EditClassModal = ({
    open,
    onClose,
    idToUpdate,
    setResMsg,
    setSeverity,
    setSnack,
    updatedSection,
    setUpdatedSection,
    updatedGradeLevel,
    setUpdatedGradeLevel,
    updatedSchoolYear,
    setUpdatedSchoolYear
}) => {

    const axiosPrivate = useAxiosPrivate()
    const { setClasses } = useData()
    const [disable, setDisable] = useState(false)

    const handleEditClass = async (e) => {
        e.preventDefault()
        setDisable(true)

        if (!updatedSection || !updatedGradeLevel || !updatedSchoolYear) {
            setResMsg('All Fields are required')
            setSeverity('error')
            setSnack(true)
            setDisable(false)
            return
        }

        if (updatedSection.length > 30) {
            setResMsg('"Oops! It looks like your text is a bit too long. Please keep it within 30 characters.')
            setSeverity('error')
            setSnack(true)
            setDisable(false)
            return
        }
        try {
            const result = await axiosPrivate.put('class', {
                "id": idToUpdate,
                "section": updatedSection,
                "gradeLevel": updatedGradeLevel,
                "schoolYear": updatedSchoolYear
            })

            setClasses(prev => prev.map(data => {
                if (data._id == idToUpdate) {
                    return result.data
                } else {
                    return data
                }
            }))

            setResMsg('Class was updated successfully.')
            setSeverity('success')
            setSnack(true)
        } catch (error) {
            setResMsg('Updated error')
            setSeverity('error')
            setSnack(true)
            console.log(error);
        }

        setDisable(false)
        onClose(false)
    }

    return (
        <Dialog open={open} onClose={() => onClose(false)} disableAutoFocus >
            <form onSubmit={handleEditClass}>
                <DialogTitle variant='h5' bgcolor="primary.main" color="#FFF">Edit Class</DialogTitle>
                <Divider />
                <DialogContent>
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
                        <Box>
                            <TextField
                                disabled={disable}
                                margin="dense"
                                id="section"
                                label="Section"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={updatedSection}
                                required
                                onChange={(e) => setUpdatedSection(e.target.value)}
                            />

                            <FormControl fullWidth margin='dense'>
                                <InputLabel id="gender">Grade Level</InputLabel>
                                <Select
                                    labelId="level"
                                    id="level"
                                    value={updatedGradeLevel}
                                    label="Grade Level"
                                    onChange={(e) => setUpdatedGradeLevel(e.target.value)}
                                    required
                                    disabled={disable}
                                >
                                    <MenuItem value={1}>1</MenuItem>
                                    <MenuItem value={2}>2</MenuItem>
                                    <MenuItem value={3}>3</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl fullWidth margin='dense'>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        label="School year"
                                        onChange={(date) => setUpdatedSchoolYear(date == null || date == 'Invalid Date' ? new Date() : date)}
                                        disabled={disable}
                                        value={updatedSchoolYear == null ? new Date() : updatedSchoolYear}
                                        disableOpenPicker
                                        format={`yyyy-${typeof (updatedSchoolYear?.getFullYear() + 1) != 'number' || updatedSchoolYear == null || typeof updatedSchoolYear != 'object' ? new Date().getFullYear() + 1 : updatedSchoolYear?.getFullYear() + 1}`}

                                    />
                                </LocalizationProvider>
                            </FormControl>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button disabled={disable} onClick={() => onClose(false)} color='inherit' sx={{ mb: 1 }}><Typography>Cancel</Typography></Button>
                    <Button type='submit' disabled={disable} sx={{ mr: 1, mb: 1 }}>{disable && <CircularProgress size={16} color='inherit' />} <Typography component={'span'} ml={1}>{disable ? 'Updating...' : 'Update'}</Typography></Button>
                </DialogActions>
            </form>

        </Dialog>
    );
}

export default EditClassModal;
