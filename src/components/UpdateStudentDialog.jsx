import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, Button, Checkbox, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, FormControlLabel, FormGroup, FormLabel, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { axiosPrivate } from '../api/axios';

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
    updateEmail,
    setUpdateFname,
    setUpdateLname,
    setUpdateMname,
    setUpdateEmail,
    setUpdatePwd,
    updatePwd,
    updateStudentsId,
    setUpdateStudentsId,
    disabilities,
    setDisabilities
}) => {
    const [pwdVisible, setPwdVisible] = useState(false)
    const [disabled, setDisabled] = useState(false)

    const { dyslexia, dysgraphia, dyscalculia } = disabilities;
    const disabilitiesRequired = [dyslexia, dysgraphia, dyscalculia].filter((v) => v).length < 1;


    const handleUpdateStudents = async (e) => {
        e.preventDefault()
        setDisabled(true)
        const selectedDisabilities = Object.keys(disabilities)
            .filter(disability => disabilities[disability])
            .map(disability => disability);

        try {
            const response = await axiosPrivate.put('/students', {
                "id": updateStudentsId,
                "firstname": updateFname.trimStart(),
                "lastname": updateLname.trimStart(),
                "middlename": updateMname.trimStart(),
                "email": updateEmail.trimStart(),
                "password": updatePwd.trimStart(),
                "learning_disabilities": selectedDisabilities

            })

            setStudents(prev => prev?.map(user => {
                if (user?._id == response?.data?.result?._id) {
                    return response?.data?.result
                } else {
                    return user
                }
            }))

            setResMsg(response?.data?.success);
            setSeverity("success")
            setSnack(true);


        } catch (error) {
            setSeverity("error")
            if (!error?.response) {
                setResMsg('No Server Response')
            } else if (error?.response?.status == 304) {
                setSeverity("warning")
                setResMsg(`No changes for student with ID: ${updateStudentsId}`)
            } else if (error?.response?.status == 409) {
                setResMsg('Email address is already use')
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

    return (
        <Dialog open={open} onClose={() => { onClose(false); setPwdVisible(false) }} >
            <form onSubmit={handleUpdateStudents}>
                <DialogTitle variant='h5' >Edit Student</DialogTitle>
                <Divider />
                <DialogContent>
                    <Box
                        display="flex"
                        gap={1}
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

                        />
                        <TextField
                            disabled={disabled}
                            required
                            autoFocus
                            margin="dense"
                            id="lname"
                            label="Last name"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={updateLname}
                            onChange={(e) => setUpdateLname(e.target.value)}
                        />
                        <TextField
                            disabled={disabled}
                            autoFocus
                            margin="dense"
                            id="mname"
                            label="Middle name"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={updateMname}
                            onChange={(e) => setUpdateMname(e.target.value)}
                        />
                    </Box>

                    <Box
                        mt={1}
                        display='flex'
                        gap={1}
                    >
                        <TextField
                            disabled={disabled}
                            required
                            autoFocus
                            margin="dense"
                            id="email"
                            label="Email Address"
                            type="email"
                            variant="outlined"
                            fullWidth
                            value={updateEmail}
                            onChange={(e) => setUpdateEmail(e.target.value)}
                        />

                        <FormControl fullWidth variant="outlined" margin='dense' sx={{ mt: 1 }}>
                            <InputLabel htmlFor="password">Password</InputLabel>
                            <OutlinedInput
                                disabled={disabled}
                                id="pwd"
                                type={pwdVisible ? 'text' : 'password'}
                                value={updatePwd}
                                onChange={(e) => setUpdatePwd(e.target.value)}
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

                    <FormControl sx={{ mt: 2 }} error={disabilitiesRequired} >
                        <FormLabel component="legend">Learning Disabilities:</FormLabel>
                        <FormGroup>
                            <FormControlLabel
                                required={disabilitiesRequired}
                                sx={{ width: 'fit-content' }}
                                control={
                                    <Checkbox disabled={disabled} checked={dyslexia} name='dyslexia' onChange={disabilitiesChange} />
                                }
                                label="Dyslexia" />

                            <FormControlLabel
                                required={disabilitiesRequired}
                                sx={{ width: 'fit-content' }}
                                control={
                                    <Checkbox disabled={disabled} checked={dysgraphia} name='dysgraphia' onChange={disabilitiesChange} />
                                }
                                label="Dysgraphia" />

                            <FormControlLabel
                                required={disabilitiesRequired}
                                sx={{ width: 'fit-content' }}
                                control={
                                    <Checkbox disabled={disabled} checked={dyscalculia} name='dyscalculia' onChange={disabilitiesChange} />
                                }
                                label="Dyscalculia" />
                        </FormGroup>
                    </FormControl>
                </DialogContent>

                <DialogActions>
                    <Button disabled={disabled} onClick={() => { onClose(false); setPwdVisible(false) }} color='inherit' sx={{ mb: 1 }}><Typography>Cancel</Typography></Button>
                    <Button type='submit' disabled={disabled} sx={{ mr: 1, mb: 1 }}>{disabled && <CircularProgress size={16} color='inherit' />} <Typography ml={1}>Update</Typography></Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}

export default UpdateStudentDialog;
