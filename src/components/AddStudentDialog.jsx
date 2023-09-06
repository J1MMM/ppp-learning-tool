import { CheckBox, Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, Button, Checkbox, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, FormControlLabel, FormGroup, FormLabel, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const AddStudentDialog = ({ open, onClose, setStudents, setResMsg, setSnack, setSeverity, setStudentsEmpty }) => {
    const axiosPrivate = useAxiosPrivate();
    const [pwdVisible, setPwdVisible] = useState(false)

    const [fname, setFname] = useState("")
    const [lname, setLname] = useState("")
    const [mname, setMname] = useState("")
    const [email, setEmail] = useState("")
    const [pwd, setPwd] = useState("")
    const [disabled, setDisabled] = useState(false)
    const [disabilities, setDisabilities] = useState({
        dyslexia: false,
        dysgraphia: false,
        dyscalculia: false,
    })
    const { dyslexia, dysgraphia, dyscalculia } = disabilities;
    const disabilitiesRequired = [dyslexia, dysgraphia, dyscalculia].filter((v) => v).length < 1;

    const handleAddStudent = async (e) => {
        e.preventDefault()
        setDisabled(true)

        const selectedDisabilities = Object.keys(disabilities)
            .filter(disability => disabilities[disability])
            .map(disability => disability);

        try {
            const response = await axiosPrivate.post('/students', {
                "firstname": fname.trimStart(),
                "lastname": lname.trimStart(),
                "middlename": mname.trimStart(),
                "email": email.trimStart(),
                "password": pwd.trimStart(),
                "learning_disabilities": selectedDisabilities
            })

            setStudents(prev => [...prev, response?.data?.result])
            setStudentsEmpty(false)
            setResMsg(response?.data?.success);
            setSeverity("success")
            setSnack(true);


        } catch (error) {
            if (!error?.response) {
                setResMsg('No Server Response')
            } else if (error?.response?.status == 409) {
                setResMsg('Email address is already use')
            } else {
                setResMsg('Request Failed')
            }
            setSeverity("error")
            setSnack(true);
        }

        setFname("")
        setLname("")
        setMname("")
        setEmail("")
        setPwd("")
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
        <Dialog open={open} onClose={() => onClose(false)} >
            <form onSubmit={handleAddStudent}>
                <DialogTitle variant='h5' >Add Student</DialogTitle>
                <Divider />
                <DialogContent>
                    <Box
                        display="flex"
                        gap={2}
                    >
                        <TextField
                            autoFocus
                            margin="dense"
                            id="fname"
                            label="First name"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={fname}
                            required
                            onChange={(e) => setFname(e.target.value)}
                        />
                        <TextField
                            required
                            autoFocus
                            margin="dense"
                            id="lname"
                            label="Last name"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={lname}
                            onChange={(e) => setLname(e.target.value)}
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="mname"
                            label="Middle name"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={mname}
                            onChange={(e) => setMname(e.target.value)}
                        />
                    </Box>

                    <Box
                        mt={1}
                        display="flex"
                        gap={2}
                    >
                        <TextField
                            required
                            autoFocus
                            margin="dense"
                            id="email"
                            label="Email Address"
                            type="email"
                            variant="outlined"
                            fullWidth
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <FormControl fullWidth variant="outlined" margin='dense'>
                            <InputLabel htmlFor="password">Password</InputLabel>
                            <OutlinedInput
                                id="pwd"
                                type={pwdVisible ? 'text' : 'password'}
                                value={pwd}
                                onChange={(e) => setPwd(e.target.value)}
                                required
                                endAdornment={
                                    <InputAdornment position="end" >
                                        <IconButton
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
                                    <Checkbox checked={dyslexia} name='dyslexia' onChange={disabilitiesChange} />
                                }
                                label="Dyslexia" />

                            <FormControlLabel
                                required={disabilitiesRequired}
                                sx={{ width: 'fit-content' }}
                                control={
                                    <Checkbox checked={dysgraphia} name='dysgraphia' onChange={disabilitiesChange} />
                                }
                                label="Dysgraphia" />

                            <FormControlLabel
                                required={disabilitiesRequired}
                                sx={{ width: 'fit-content' }}
                                control={
                                    <Checkbox checked={dyscalculia} name='dyscalculia' onChange={disabilitiesChange} />
                                }
                                label="Dyscalculia" />
                        </FormGroup>
                    </FormControl>
                </DialogContent>

                <DialogActions>
                    <Button disabled={disabled} onClick={() => onClose(false)} color='inherit' sx={{ mb: 1 }}><Typography>Cancel</Typography></Button>
                    <Button type='submit' disabled={disabled} sx={{ mr: 1, mb: 1 }}>{disabled && <CircularProgress size={16} color='inherit' />} <Typography ml={1}>Submit</Typography></Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}

export default AddStudentDialog;
