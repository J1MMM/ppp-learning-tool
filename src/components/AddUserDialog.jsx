import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, FormControlLabel, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField } from '@mui/material';
import React, { useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const AddUserDialog = ({ open, onClose, setUsers, setResMsg, setSnack, setSeverity }) => {
    const axiosPrivate = useAxiosPrivate();
    const [pwdVisible, setPwdVisible] = useState(false)

    const [fname, setFname] = useState("")
    const [lname, setLname] = useState("")
    const [mname, setMname] = useState("")
    const [email, setEmail] = useState("")
    const [pwd, setPwd] = useState("")
    const [disabled, setDisabled] = useState(false)

    const handleAddUser = async (e) => {
        e.preventDefault()
        setDisabled(true)

        try {
            const response = await axiosPrivate.post('users', {
                "firstname": fname.trimStart(),
                "lastname": lname.trimStart(),
                "middlename": mname.trimStart(),
                "email": email.trimStart(),
                "password": pwd.trimStart()
            })

            setUsers(prev => [...prev, response?.data?.result])
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
        onClose(false)
        setDisabled(false)
    }

    return (
        <Dialog open={open} onClose={() => onClose(false)} >
            <form onSubmit={handleAddUser}>
                <DialogTitle variant='h5' >Add user</DialogTitle>
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
                        display='flex'
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

                        <FormControl fullWidth variant="outlined" margin='dense' >
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
                    <FormControlLabel control={<Checkbox disabled checked />} label="Teacher" />
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => onClose(false)} color='inherit'>Cancel</Button>
                    <Button type='submit' disabled={disabled}>Submit</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}

export default AddUserDialog;
