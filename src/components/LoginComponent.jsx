import React, { useEffect, useRef, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import pppLogo from '../assets/images/ppp-logo.svg'
import { Link, Box, Button, Container, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField, Typography, Alert, Collapse } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import useAuth from '../hooks/useAuth';

import img1 from '../assets/images/login-slide1.svg'
import img2 from '../assets/images/login-slide2.svg'
import img3 from '../assets/images/login-slide3.svg'
import LoginSlides from './LoginSlides';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import SnackBar from './SnackBar'

const LOGIN_URL = '/auth';

const LoginComponenet = () => {
    const { auth, setAuth } = useAuth()
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const userRef = useRef();

    const [email, setEmail] = useState('')
    const [pwd, setPwd] = useState('')
    const [errMsg, setErrMsg] = useState('')
    const [pwdVisible, setPwdVisible] = useState(false)
    const [formDisabled, setFormDisabled] = useState(false)
    const [snackOpen, setSnackOpen] = useState(false)
    const [snackSev, setSnackSev] = useState("error")

    useEffect(() => {
        setSnackOpen(false)
        setErrMsg('')
    }, [email, pwd])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormDisabled(true)
        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({ email, pwd }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            )
            const accessToken = response?.data?.accessToken;
            const roles = response?.data?.roles;
            const fullname = response?.data?.fullname;

            setAuth({ email, roles, accessToken, fullname })
            setEmail('')
            setPwd('')
            navigate(from, { replace: true })

        } catch (error) {
            setSnackOpen(true)
            if (!error?.response) {
                setErrMsg('No Server Response')
            } else if (error.response?.status == 400) {
                setErrMsg('All Field required')
            } else if (error.response?.status == 401) {
                setErrMsg('Incorrect Email or Password')
            } else {
                setErrMsg('Login Failed')
            }
        }
        setFormDisabled(false)
    }

    if (auth?.accessToken) {
        return <Navigate to="/" />
    }

    const slides = [
        {
            img: img1,
            title: "Online Learning Tools for Educators in PPP",
            sub: "New Approach to Kids Education"
        },
        {
            img: img2,
            title: "Efficient Lesson Management for Workflow Enhancement",
            sub: "Powerful Tools to Organize, and Deliver Engaging Lessons"
        },
        {
            img: img3,
            title: "Ensuring Your Online Safety",
            sub: "Experience a Secure and Trustworthy Learning Environment"
        },
    ]

    const slideEl = slides.map((item, index) => {
        return (
            <SwiperSlide key={index} >
                <LoginSlides img={item.img} title={item.title} sub={item.sub} />
            </SwiperSlide>
        )
    })

    return (
        <Box
            sx={{
                minHeight: {
                    xs: "95vh",
                    sm: "none"
                },
            }}
            display="flex"
            alignItems="center"
            bgcolor="lightgrey"
            width="100%"
            height="100vh"
            boxSizing="border-box"
            overflow="hidden"
            p={2}

        >
            <Container
                maxWidth='md'
                sx={{
                    boxSizing: 'border-box',
                    bgcolor: 'white',
                    height: '100%',
                    gridTemplateColumns: {
                        xs: "1fr",
                        sm: "1fr 1fr",
                    },
                    minHeight: {
                        xs: "450px",
                        sm: "none"
                    },
                    maxHeight: {
                        xs: "450px",
                        sm: "700px",
                    },
                    p: {
                        xs: 1,
                        sm: 3
                    },
                    mt: {
                        xs: -10,
                        sm: 0
                    },
                    justifyItems: "center",
                    borderRadius: 3,
                    boxShadow: '10px 10px 25px -9px rgba(0,0,0,0.36)',
                    WebkitBoxShadow: '10px 10px 25px -9px rgba(0,0,0,0.36)',
                    MozBoxShadow: '10px 10px 25px -9px rgba(0,0,0,0.36)',
                    display: 'grid',
                    position: 'relative'
                }}

            >
                <Box
                    boxSizing="border-box"
                    bgcolor="primary.main"
                    height="100%"
                    width="100%"
                    borderRadius={3}
                    p={3}
                    alignItems="center"
                    position="relative"
                    sx={{
                        maxWidth: {
                            xs: "150px",
                            sm: "350px",
                            md: "400px",
                            lg: "457px"
                        },
                        display: {
                            xs: "none",
                            sm: "flex"
                        }
                    }}
                >

                    <Swiper
                        spaceBetween={30}
                        centeredSlides={true}
                        autoplay={{
                            delay: 2500,
                            disableOnInteraction: false,

                        }}
                        pagination={{
                            clickable: true,
                        }}
                        modules={[Autoplay, Pagination]}
                        className="mySwiper"
                        style={{
                            height: '100%',
                            width: '100%',
                            maxWidth: "457px",
                            "--swiper-pagination-color": "#FFD500",
                        }}

                    >
                        {slideEl}
                    </Swiper>

                </Box>
                <Box
                    boxSizing="border-box"
                    height="100%"
                    width="100%"
                    maxWidth="371px"
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="baseline"
                    borderRadius={3}
                    p={3}
                >
                    <img src={pppLogo} style={{ width: '100%', maxWidth: '130px' }} />
                    <Typography variant='h5' mt={3} fontWeight={500} color="#424242">Get Started Now</Typography>
                    <Typography
                        variant='caption'
                        mb={3}
                        sx={{
                            fontSize: {
                                xs: '10px',
                                sm: ''
                            }
                        }}
                    >Enter your credentials to access your account</Typography>

                    <form style={{ width: '100%' }} onSubmit={handleSubmit}>
                        <TextField
                            label="Email"
                            variant="outlined"
                            fullWidth
                            name='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            type='email'
                            error={errMsg ? true : false}
                            disabled={formDisabled ? true : false}
                        />

                        <FormControl fullWidth variant="outlined" sx={{ mt: 3 }}>
                            <InputLabel htmlFor="password">Password</InputLabel>
                            <OutlinedInput
                                id="password"
                                type={pwdVisible ? 'text' : 'password'}
                                name='pwd'
                                value={pwd}
                                onChange={(e) => setPwd(e.target.value)}
                                required
                                error={errMsg ? true : false}
                                disabled={formDisabled ? true : false}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            disabled={formDisabled}
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
                        <Link
                            href="#forgot-password"
                            variant='subtitle2'
                            mt={1}
                            sx={{ textDecoration: 'none', float: 'right' }}
                        >Forgot password?</Link>

                        <Button
                            variant='contained'
                            fullWidth
                            sx={{ mt: 2 }}
                            size='large'
                            type='submit'
                            disabled={formDisabled}
                        >Login</Button>
                    </form>
                </Box>
            </Container>

            <SnackBar
                msg={errMsg}
                open={snackOpen}
                onClose={setSnackOpen}
                severity={snackSev}
                position={{ horizontal: 'right', vertical: 'top' }}
            />
        </Box>
    );
}

export default LoginComponenet;
