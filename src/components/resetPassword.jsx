import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, Button, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import SnackBar from './SnackBar';
import axios from '../api/axios';
import { useNavigate, useParams } from 'react-router-dom';

const ResetPassword = () => {
    const { token } = useParams()
    const navigate = useNavigate()

    const [pwd1Visible, setPwd1Visible] = useState(false)
    const [pwd2Visible, setPwd2Visible] = useState(false)
    const [pwd1, setPwd1] = useState("")
    const [pwd2, setPwd2] = useState("")

    const [snackActive, setSnackActive] = useState(false)
    const [snackSev, setSnackSev] = useState("success")

    const [errMsg, setErrMsg] = useState("")
    const [formDisabled, setFormDisabled] = useState(false)

    useEffect(() => {
        setErrMsg("")
    }, [pwd1, pwd2])

    useEffect(() => {
        document.title = "PPPedu | Reset Password"
    }, [])

    const handleResetPwd = async (e) => {
        e.preventDefault()
        setFormDisabled(true)
        if (!pwd1 || !pwd2) return;

        if (pwd1.length < 8 || pwd2.length < 8) {
            setErrMsg("Please enter at least 8 characters.")
            setSnackActive(true)
            setSnackSev("error")
            setFormDisabled(false)
            return;
        }

        if (pwd1 !== pwd2) {
            setErrMsg("Password do not match.")
            setSnackActive(true)
            setSnackSev("error")
            setFormDisabled(false)
            return;
        }

        try {
            const response = await axios.put('/reset-password', {
                token: token,
                pwd: pwd2
            })
            console.log(response);
            setErrMsg(response.data?.message)
            setSnackActive(true)
            setSnackSev("success")

            setTimeout(() => {
                navigate('/', { replace: true })
            }, 3000)

        } catch (err) {
            console.log(err);
            setErrMsg(err.data?.response?.message)
            setSnackActive(true)
            setSnackSev("error")
            setFormDisabled(false)
        }
    }
    return (
        <Box bgcolor="#f5f5f3" width="100%" height="100vh" display="flex" justifyContent="center" alignItems="center" p={1} boxSizing="border-box">
            <Box bgcolor="#FFF" width="100%" maxWidth="450px" borderRadius={3} p={5} sx={{
                boxShadow: '10px 10px 25px -9px rgba(0,0,0,0.36)',
                WebkitBoxShadow: '10px 10px 25px -9px rgba(0,0,0,0.36)',
                MozBoxShadow: '10px 10px 25px -9px rgba(0,0,0,0.36)',
            }}>
                <form style={{ display: 'flex', flexDirection: 'column', gap: '24px' }} onSubmit={handleResetPwd}>
                    <Typography component={'span'} variant='h5'>Change Password</Typography>

                    <FormControl fullWidth variant="outlined" >
                        <InputLabel htmlFor="password">New Password</InputLabel>
                        <OutlinedInput
                            disabled={formDisabled ? true : false}
                            error={errMsg ? true : false}
                            autoComplete='off'
                            id="pwd1"
                            type={pwd1Visible ? 'text' : 'password'}
                            name='pwd'
                            required
                            onChange={(e) => setPwd1(e.target.value)}
                            value={pwd1}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        edge="end"
                                        onClick={() => setPwd1Visible(!pwd1Visible)}
                                    >
                                        {pwd1Visible ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Password"
                        />
                    </FormControl>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel htmlFor="password">Confirm Password</InputLabel>
                        <OutlinedInput
                            disabled={formDisabled ? true : false}

                            error={errMsg ? true : false}
                            autoComplete='off'
                            id="pwd2"
                            type={pwd2Visible ? 'text' : 'password'}
                            name='pwd'
                            required
                            onChange={(e) => setPwd2(e.target.value)}
                            value={pwd2}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        edge="end"
                                        onClick={() => setPwd2Visible(!pwd2Visible)}
                                    >
                                        {pwd2Visible ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Password"
                        />
                    </FormControl>

                    <Button
                        disabled={formDisabled ? true : false}
                        variant='contained'
                        fullWidth
                        sx={{ mt: 1 }}
                        size='large'
                        type='submit'

                    >
                        Reset password
                    </Button>
                </form>
            </Box>
            <SnackBar msg={errMsg} onClose={setSnackActive} open={snackActive} severity={snackSev} />
        </Box>
    );
}

export default ResetPassword;
