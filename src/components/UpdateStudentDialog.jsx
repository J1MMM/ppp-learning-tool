import { Help, Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, Button, Checkbox, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, FormControlLabel, FormGroup, FormLabel, IconButton, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { axiosPrivate } from '../api/axios';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { differenceInYears, set } from 'date-fns';
import { useParams } from 'react-router-dom';
import useData from '../hooks/useData';

const UpdateStudentDialog = ({
    open,
    onClose,
    setStudents,
    setResMsg,
    setSnack,
    setSeverity,
    updateFname,
    updateLname,
    updateMname,
    updateUsername,
    updateEmail,
    setUpdateFname,
    setUpdateLname,
    setUpdateMname,
    setUpdateUsername,
    setUpdateEmail,
    setUpdatePwd,
    updatePwd,
    updateStudentsId,
    setUpdateStudentsId,
    disabilities,
    setDisabilities,
    updateGender,
    updateGuardian,
    updateAddress,
    updateContactNo,
    updateDateOfBirth,
    setUpdateGender,
    setUpdateGuardian,
    setUpdateAddress,
    setUpdateContactNo,
    setUpdateDateOfBirth,
    updateAge,
    setUpdateAge,
    setAlphabetically

}) => {
    const { archiveMode } = useData()
    const { id } = useParams()
    const [pwdVisible, setPwdVisible] = useState(false)
    const [disabled, setDisabled] = useState(false)
    const [formReadOnly, setFormReadOnly] = useState(true)

    const { dyslexia, dysgraphia, dyscalculia } = disabilities;
    const disabilitiesRequired = [dyslexia, dysgraphia, dyscalculia].filter((v) => v).length < 1;


    const handleUpdateStudents = async (e) => {
        e.preventDefault()
        setDisabled(true)
        setFormReadOnly(true)

        if (disabilitiesRequired) {
            setResMsg("All fields are required");
            setSeverity("error")
            setSnack(true);
            setDisabled(false)
            return;
        }

        if (updateFname.length < 2 || updateLname.length < 2 || updateUsername.length < 2) {
            setResMsg("Student name and username should be at least 2 characters");
            setSeverity("error")
            setSnack(true);
            setDisabled(false)
            return;
        }

        if (updateDateOfBirth) {

            const age = differenceInYears(new Date(), updateDateOfBirth);

            if (age < 5) {
                setResMsg("Age must be 5 or older");
                setSeverity("error")
                setSnack(true);
                setDisabled(false)
                return;
            }
        }


        if (updatePwd && updatePwd.length < 8) {
            setResMsg("Password should be at least 8 characters");
            setSeverity("error")
            setSnack(true);
            setDisabled(false)
            return;
        }

        const selectedDisabilities = Object.keys(disabilities)
            .filter(disability => disabilities[disability])
            .map(disability => disability);

        try {
            const response = await axiosPrivate.put('/students', {
                "id": updateStudentsId,
                "firstname": updateFname.trimStart().trimEnd(),
                "lastname": updateLname.trimStart().trimEnd(),
                "middlename": updateMname.trimStart().trimEnd(),
                "username": updateUsername.trimStart().trimEnd(),
                "email": updateEmail.trimStart().trimEnd(),
                "password": updatePwd.trimStart().trimEnd(),
                "learning_disabilities": selectedDisabilities,
                "gender": updateGender,
                "guardian": updateGuardian.trimStart().trimEnd(),
                "address": updateAddress.trimStart().trimEnd(),
                "contactNo": updateContactNo,
                "birthday": updateDateOfBirth,
                "classID": id
            })

            setStudents(prev => {
                return prev.map(data => {
                    if (data._id == updateStudentsId) {
                        return response.data?.result
                    }
                    return data
                })
            })
            setResMsg(response?.data?.success);
            setSeverity("success")
            setSnack(true);

        } catch (error) {
            setSeverity("error")
            if (!error?.response) {
                setResMsg('No Server Response')
            } else if (error?.response?.status == 304) {
                setSeverity("warning")
                setResMsg(`No changes for student with email: ${updateEmail}`)
            } else if (error?.response?.status == 409) {
                setResMsg(error.response?.data?.message)
            } else {
                setResMsg('Request Failed')
            }
            setSnack(true);
        }

        setUpdateStudentsId("")
        setUpdateFname("")
        setUpdateLname("")
        setUpdateMname("")
        setUpdateEmail("")
        setUpdateUsername("")
        setUpdatePwd("")
        setDisabilities({
            dyslexia: false,
            dysgraphia: false,
            dyscalculia: false,
        })
        onClose(false)
        setDisabled(false)
    }

    const disabilitiesChange = (event) => {
        setDisabilities({
            ...disabilities,
            [event.target.name]: event.target.checked,
        });
    }
    const handleDateChange = (date) => {
        setUpdateDateOfBirth(date)
        const age = differenceInYears(new Date(), date)
        setUpdateAge(`${age} years old`)
    }
    // console.log(typeof updateDateOfBirth);
    return (
        <Dialog open={open} onClose={() => { onClose(false); setPwdVisible(false); setFormReadOnly(true) }} disableAutoFocus sx={{ filter: archiveMode ? 'grayscale(1)' : '' }}>
            <form onSubmit={handleUpdateStudents}>
                <DialogTitle variant='h6' bgcolor="primary.main" color="#FFF" >Details</DialogTitle>
                <Divider />
                <DialogContent>
                    <Box
                        display="flex"
                        gap={1}
                        sx={{
                            flexDirection: {
                                xs: "column",
                                sm: "row"
                            }
                        }}
                    >
                        <TextField
                            disabled={disabled}
                            required
                            autoFocus
                            margin="dense"
                            id="fname"
                            label="First name"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={updateFname}
                            onChange={(e) => setUpdateFname(e.target.value)}
                            inputProps={{ readOnly: formReadOnly }}
                        />
                        <TextField
                            disabled={disabled}
                            required
                            margin="dense"
                            id="lname"
                            label="Last name"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={updateLname}
                            onChange={(e) => setUpdateLname(e.target.value)}
                            inputProps={{ readOnly: formReadOnly }}
                        />
                        <TextField
                            disabled={disabled}
                            margin="dense"
                            id="mname"
                            label="Middle name"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={updateMname}
                            onChange={(e) => setUpdateMname(e.target.value)}
                            inputProps={{ readOnly: formReadOnly }}
                        />
                    </Box>

                    <TextField
                        disabled={disabled}
                        required
                        margin="dense"
                        id="address"
                        label="Address"
                        type="text"
                        variant="outlined"
                        value={updateAddress}
                        onChange={(e) => setUpdateAddress(e.target.value)}
                        fullWidth
                        inputProps={{ readOnly: formReadOnly }}
                    />

                    <Box
                        mt={1}
                        display="flex"
                        gap={2}
                        sx={{
                            flexDirection: {
                                xs: "column",
                                sm: "row"
                            }
                        }}

                    >
                        <FormControl fullWidth margin='dense'>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker label="Date of birth" onChange={(date) => handleDateChange(date)} disabled={disabled} value={updateDateOfBirth} readOnly={formReadOnly} />
                            </LocalizationProvider>
                        </FormControl>

                        <FormControl fullWidth margin='dense' >
                            <InputLabel id="gender">Sex</InputLabel>
                            <Select
                                labelId="gender"
                                id="gender"
                                value={updateGender}
                                label="Gender"
                                onChange={(e) => setUpdateGender(e.target.value)}
                                required
                                disabled={disabled}
                                inputProps={{ readOnly: formReadOnly }}
                            >
                                <MenuItem value={"male"}>Male</MenuItem>
                                <MenuItem value={"female"}>Female</MenuItem>
                            </Select>
                        </FormControl>

                        <TextField
                            disabled={disabled}
                            required
                            margin="dense"
                            id="contactNo"
                            label="Phone number"
                            type='text'
                            variant="outlined"
                            fullWidth
                            value={updateContactNo}
                            onChange={(e) => setUpdateContactNo(e.target.value)}
                            inputProps={{ readOnly: formReadOnly }}
                        />
                    </Box>
                    <Box
                        mt={1}
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
                            margin="dense"
                            id="age"
                            label="Age"
                            type='text'
                            variant="outlined"
                            fullWidth
                            value={updateAge}
                            inputProps={{ readOnly: true }}
                            focused={false}

                        />

                        <TextField
                            disabled={disabled}
                            required
                            margin="dense"
                            id="guardian"
                            label="Parent/Guardian"
                            type='text'
                            variant="outlined"
                            fullWidth
                            value={updateGuardian}
                            onChange={(e) => setUpdateGuardian(e.target.value)}
                            inputProps={{ readOnly: formReadOnly }}
                        />
                    </Box>
                    <TextField
                        disabled={disabled}
                        required
                        margin="dense"
                        id="email"
                        label="Email Address"
                        type="email"
                        variant="outlined"
                        fullWidth
                        value={updateEmail}
                        onChange={(e) => setUpdateEmail(e.target.value)}
                        inputProps={{ readOnly: formReadOnly }}
                    />
                    <Box
                        mt={1}
                        display='flex'
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
                            required
                            margin="dense"
                            id="username"
                            label="Username"
                            type="text"
                            variant="outlined"
                            fullWidth
                            value={updateUsername}
                            onChange={(e) => setUpdateUsername(e.target.value)}
                            inputProps={{ readOnly: formReadOnly }}
                        />

                        <FormControl fullWidth variant="outlined" margin='dense'>
                            <InputLabel htmlFor="password">Password</InputLabel>
                            <OutlinedInput
                                disabled={disabled}
                                id="pwd"
                                type={pwdVisible ? 'text' : 'password'}
                                value={updatePwd}
                                onChange={(e) => setUpdatePwd(e.target.value)}
                                inputProps={{ readOnly: formReadOnly }}
                                endAdornment={
                                    <InputAdornment position="end" >
                                        <IconButton
                                            disabled={disabled}
                                            edge="end"
                                            onClick={() => setPwdVisible(!pwdVisible)}
                                        >
                                            {pwdVisible ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Password"
                            />
                        </FormControl>
                    </Box>
                    <Box display={'flex'} gap={1} alignItems={'center'}>
                        <Help fontSize='small' color='primary' />
                        <Typography fontSize='small' sx={{ color: 'primary.main' }}>username and password will be used to login to the PPPKids game.</Typography>
                    </Box>
                    <FormControl sx={{ mt: 2 }} error={disabilitiesRequired} >
                        <FormLabel component="legend">Learning Disabilities:</FormLabel>
                        <Box display={'flex'} alignItems={'center'} >
                            <FormControlLabel
                                sx={{ width: 'fit-content' }}
                                control={
                                    <Checkbox disabled={disabled || formReadOnly} checked={dyslexia} name='dyslexia' onChange={disabilitiesChange} />
                                }
                                label="Dyslexia" />

                            <FormControlLabel
                                sx={{ width: 'fit-content' }}
                                control={
                                    <Checkbox disabled={disabled || formReadOnly} checked={dysgraphia} name='dysgraphia' onChange={disabilitiesChange} />
                                }
                                label="Dysgraphia" />

                            <FormControlLabel
                                sx={{ width: 'fit-content' }}
                                control={
                                    <Checkbox disabled={disabled || formReadOnly} checked={dyscalculia} name='dyscalculia' onChange={disabilitiesChange} />
                                }
                                label="Dyscalculia" />
                        </Box>
                    </FormControl>
                </DialogContent>

                <DialogActions>
                    {formReadOnly ?
                        <>
                            <Button disabled={disabled} onClick={() => { onClose(false); setPwdVisible(false); setFormReadOnly(true) }} color='inherit' sx={{ mb: 1 }}><Typography>Close</Typography></Button>
                            <Button disabled={disabled || archiveMode} type='button' onClick={() => setFormReadOnly(false)} color='warning' sx={{ mb: 1 }}><Typography>Edit Info</Typography></Button>

                        </>
                        :
                        <>
                            <Button type='submit' disabled={disabled} sx={{ mr: 1, mb: 1 }}>{disabled && <CircularProgress size={16} color='inherit' />} <Typography component={'span'} ml={1}>Save Changes</Typography></Button>
                            <Button disabled={disabled} onClick={() => { setFormReadOnly(true) }} color='inherit' sx={{ mb: 1 }}><Typography>Cancel</Typography></Button>
                        </>
                    }
                </DialogActions>
            </form>

        </Dialog>
    );
}

export default UpdateStudentDialog;
