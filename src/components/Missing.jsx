import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import img404 from '../assets/images/404.svg'
import { useNavigate } from 'react-router-dom';

const Missing = () => {
    document.title = "Page 404"
    const navigate = useNavigate()
    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height='80vh'
            flexDirection="column"
        >
            <img src={img404} alt="" style={{ maxWidth: '40rem' }} />
            <Typography component={'span'} variant='h3' color="#3F3D56" mt={3}>Page not Found</Typography>

            <Button variant='contained' sx={{ mt: 3 }} onClick={() => navigate('/')}>Go Home</Button>
        </Box>
    );
}

export default Missing;
