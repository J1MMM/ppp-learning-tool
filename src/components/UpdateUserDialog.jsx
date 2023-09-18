import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { axiosPrivate } from '../api/axios';

const UpdateUserDialog = ({
    open,
    onClose,
    setUsers,
    setResMsg,
    setSnack,
    setSeverity,
    updateUserId,
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
    setUpdateUserId
}) => {
    const [pwdVisible, setPwdVisible] = useState(false)
    const [disabled, setDisabled] = useState(false)

    const handleUpdateUser = async (e) => {
        e.preventDefault()
        setDisabled(true)

        if (updateFname.length < 2 || updateLname.length < 2) {
            setResMsg("first and last name should be at least 2 characters");
            setSeverity("error")
            setSnack(true);
            setDisabled(false)
            return;
        }

        if (updatePwd && updatePwd.length < 8) {
            setResMsg("Password should be at least 8 characters");
            setSeverity("error")
            setSnack(true);
            setDisabled(false)
            return;
        }

        try {
            const response = await axiosPrivate.put('users', {
                "id": updateUserId,
                "firstname": updateFname.trimStart().trimEnd(),
                "lastname": updateLname.trimStart().trimEnd(),
                "middlename": updateMname?.trimStart()?.trimEnd(),
                "email": updateEmail.trimStart().trimEnd(),
                "password": updatePwd?.trimStart()?.trimEnd()
            })

            // setUsers(prev => prev?.map(user => {
            //     if (user?._id == response?.data?.result?._id) {
            //         return response?.data?.result
            //     } else {
            //         return user
            //     }
            // }))

            setUsers(prev => {
                const newData = prev?.map(user => {
                    if (user?._id == response?.data?.result?._id) {
                        return response?.data?.result
                    } else {
                        return user
                    }
                })

                const sortedData = [...newData].sort((a, b) => {
                    return a['lastname'].localeCompare(b['lastname']);
                });

                return sortedData
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
                setResMsg(`No changes for user with ID: ${updateUserId}`)
            } else if (error?.response?.status == 409) {
                setResMsg('Email address is already use')
            } else {
                setResMsg('Request Failed')
            }
            setSnack(true);
        }

        setUpdateUserId("")
        setUpdateFname("")
        setUpdateLname("")
        setUpdateMname("")
        setUpdateEmail("")
        setUpdatePwd("")
        onClose(false)
        setDisabled(false)
    }

    return (
        <Dialog open={open} onClose={() => { onClose(false); setPwdVisible(false) }} disableAutoFocus>
            <form onSubmit={handleUpdateUser}>
                <DialogTitle variant='h5' >Edit user </DialogTitle>
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
                        />
                    </Box>

                    <Box
                        mt={1}
                        display='flex'
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
                </DialogContent>

                <DialogActions>
                    <Button disabled={disabled} onClick={() => { onClose(false); setPwdVisible(false) }} color='inherit' sx={{ mb: 1 }}><Typography>Cancel</Typography></Button>
                    <Button type='submit' disabled={disabled} sx={{ mr: 1, mb: 1 }}>{disabled && <CircularProgress size={16} color='inherit' />} <Typography ml={1}>Save</Typography></Button>

                </DialogActions>
            </form>
        </Dialog>
    );
}

export default UpdateUserDialog;
