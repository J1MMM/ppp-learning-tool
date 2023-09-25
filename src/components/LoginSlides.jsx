import React from 'react';
import { Box, Typography } from '@mui/material';

const LoginSlides = ({ img, title, sub }) => {
    return (
        <Box
            boxSizing="border-box"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height='100%'
            width="100%"
        >
            <Box bgcolor='rgba(0,0,0,0.6)' height='100%' width='100%' zIndex={8} position='absolute' top={0} left={0} />
            <img src={img} alt="" style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                top: 0,
                left: 0,
                objectFit: 'cover',
                zIndex: '5'
            }} />

            <Typography
                zIndex={10}
                color="white"
                mt='80%'
                variant='h5'
                width="90%"
                fontWeight='500'
                fontSize='xx-large'
            >{title}</Typography>

            <Typography
                mt={1}
                zIndex={10}
                color="white"
                variant='caption'
                width="90%"
                fontStyle='italic'
                fontSize='large'
            ><q>{sub}</q></Typography>
        </Box>
    );
}

export default LoginSlides;
