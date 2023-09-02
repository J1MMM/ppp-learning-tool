import React from 'react';
import { Box, Typography } from '@mui/material';

const LoginSlides = ({ img, title, sub }) => {
    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height='100%'
            position="relative"
        >
            <img src={img} alt="" style={{
                width: '80%'
            }} />

            <Typography
                color="white"
                mt={5}
                variant='h5'
                width="100%"
                textAlign='center'
            >{title}</Typography>

            <Typography
                color="white"
                variant='caption'
                width="100%"
                textAlign='center'
            >{sub}</Typography>
        </Box>
    );
}

export default LoginSlides;
