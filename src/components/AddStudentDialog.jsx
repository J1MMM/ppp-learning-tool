import { CheckBox, Help, Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, Button, Checkbox, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, FormControlLabel, FormGroup, FormLabel, IconButton, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { differenceInYears } from 'date-fns';
import { useParams } from 'react-router-dom';

const AddStudentDialog = ({ open, onClose, setStudents, setResMsg, setSnack, setSeverity, setStudentsEmpty }) => {
    const { id } = useParams()
    const axiosPrivate = useAxiosPrivate();
    const [pwdVisible, setPwdVisible] = useState(false)

    const [fname, setFname] = useState("")
    const [lname, setLname] = useState("")
    const [mname, setMname] = useState("")
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [pwd, setPwd] = useState("")
    const [address, setAddress] = useState("")
    const [gender, setGender] = useState("")
    const [contactNo, setContactNo] = useState("")
    const [guardian, setGuardian] = useState("")
    const [dateOfBirth, setDateOfBirth] = useState(null)
    const [age, setAge] = useState("")


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

        if (!dateOfBirth || disabilitiesRequired) {
            setResMsg("All fields are required");
            setSeverity("error")
            setSnack(true);
            setDisabled(false)
            return;
        }
        const age = differenceInYears(new Date(), dateOfBirth);

        if (age < 5) {
            setResMsg("Age must be 5 or older");
            setSeverity("error")
            setSnack(true);
            setDisabled(false)
            return;
        }

        if (fname.length < 2 || lname.length < 2 || username.length < 2) {
            setResMsg("Student name and username should be at least 2 characters");
            setSeverity("error")
            setSnack(true);
            setDisabled(false)
            return;
        }

        if (pwd.length < 8) {
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
            const response = await axiosPrivate.post('/students', {
                "firstname": fname.trimStart().trimEnd(),
                "lastname": lname.trimStart().trimEnd(),
                "middlename": mname.trimStart().trimEnd(),
                "username": username.trimStart().trimEnd(),
                "email": email.trimStart().trimEnd(),
                "password": pwd.trimStart().trimEnd(),
                "gender": gender,
                "address": address.trimStart().trimEnd(),
                "contactNo": contactNo,
                "guardian": guardian.trimStart().trimEnd(),
                "birthday": dateOfBirth,
                "learning_disabilities": selectedDisabilities,
                "classID": id
            })

            setStudents(prev => [...prev, response.data.result]);
            setStudentsEmpty(false)
            setResMsg(response?.data?.success);
            setSeverity("success")
            setSnack(true);

        } catch (error) {
            if (!error?.response) {
                setResMsg('No Server Response')
            } else if (error?.response?.status == 409) {
                setResMsg(error.response?.data?.message)
                setDisabilities({
                    dyslexia: false,
                    dysgraphia: false,
                    dyscalculia: false,
                })
                setSeverity("error")
                setSnack(true);
                setDisabled(false)
                return
            } else {
                setResMsg('Request Failed')
            }
            setSeverity("error")
            setSnack(true);
        }

        setFname("")
        setLname("")
        setMname("")
        setUsername("")
        setEmail("")
        setPwd("")
        setGender("")
        setGuardian("")
        setContactNo("")
        setAddress("")
        setDateOfBirth(null)
        setAge("")
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

    const handleBdayChange = (date) => {
        setDateOfBirth(date)
        const age = differenceInYears(new Date(), date)
        setAge(`${age} years old`)
    }

    return (
        <Dialog open={open} onClose={() => onClose(false)} disableAutoFocus >
            <form onSubmit={handleAddStudent} >
                <DialogTitle variant='h6' bgcolor="primary.main" color="#FFF" >Add Student</DialogTitle>
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
                        <TextField
                            autoFocus
                            disabled={disabled}
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
                            disabled={disabled}
                            required
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
                            disabled={disabled}
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




                    <TextField
                        disabled={disabled}
                        required
                        margin="dense"
                        id="address"
                        label="Address"
                        type="text"
                        variant="outlined"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        fullWidth

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
                                <DatePicker label="Date of birth" onChange={(date) => handleBdayChange(date)} disabled={disabled} />
                            </LocalizationProvider>
                        </FormControl>

                        <FormControl fullWidth margin='dense'>
                            <InputLabel id="gender">Sex</InputLabel>
                            <Select
                                labelId="gender"
                                id="gender"
                                value={gender}
                                label="Gender"
                                onChange={(e) => setGender(e.target.value)}
                                required
                                disabled={disabled}
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
                            type='number'
                            variant="outlined"
                            fullWidth
                            value={contactNo}
                            onChange={(e) => setContactNo(e.target.value)}
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
                            value={age}
                            inputProps={{ readOnly: true }}
                            focused={false}
                        />
                        <TextField
                            id="guardian"
                            disabled={disabled}
                            required
                            margin="dense"
                            label="Parent/Guardian"
                            type="text"
                            variant="outlined"
                            value={guardian}
                            onChange={(e) => setGuardian(e.target.value)}
                            fullWidth

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
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}

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

                        <TextField
                            disabled={disabled}
                            required
                            margin="dense"
                            id="username"
                            label="Username"
                            type="text"
                            variant="outlined"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            fullWidth

                        />
                        <FormControl fullWidth variant="outlined" margin='dense'>
                            <InputLabel htmlFor="password">Password</InputLabel>
                            <OutlinedInput
                                disabled={disabled}
                                id="pwd"
                                type={pwdVisible ? 'text' : 'password'}
                                value={pwd}
                                onChange={(e) => setPwd(e.target.value)}
                                required
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

                    <FormControl sx={{ mt: 2 }} error={disabilitiesRequired}>
                        <FormLabel component="legend">Learning Disabilities:</FormLabel>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                            <FormControlLabel
                                sx={{ width: 'fit-content' }}
                                control={
                                    <Checkbox disabled={disabled} checked={dyslexia} name='dyslexia' onChange={disabilitiesChange} />
                                }
                                label="Dyslexia" />

                            <FormControlLabel
                                sx={{ width: 'fit-content' }}
                                control={
                                    <Checkbox disabled={disabled} checked={dysgraphia} name='dysgraphia' onChange={disabilitiesChange} />
                                }
                                label="Dysgraphia" />

                            <FormControlLabel
                                sx={{ width: 'fit-content' }}
                                control={
                                    <Checkbox disabled={disabled} checked={dyscalculia} name='dyscalculia' onChange={disabilitiesChange} />
                                }
                                label="Dyscalculia" />
                        </Box>
                    </FormControl>
                </DialogContent>

                <DialogActions>
                    <Button disabled={disabled} onClick={() => onClose(false)} color='inherit' sx={{ mb: 1 }}><Typography>Cancel</Typography></Button>
                    <Button type='submit' disabled={disabled} sx={{ mr: 1, mb: 1 }}>{disabled && <CircularProgress size={16} color='inherit' />} <Typography component={'span'} ml={1}>Submit</Typography></Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}

export default AddStudentDialog;
