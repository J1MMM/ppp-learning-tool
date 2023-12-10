import { Box, Grow, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import unauthorizedImg from '../assets/images/denied.svg'

const Unauthorized = () => {

    document.title = "Unauthorized"

    const navigate = useNavigate()
    return (
        <Grow in={true}>
            <Box
                width="100%"
                height='80vh'
                display='flex'
                justifyContent='center'
                alignItems='center'
                flexDirection='column'
            >
                <img src={unauthorizedImg} style={{ maxWidth: '20rem' }} />
                <Typography component={'span'} variant='h4' color="rgb(63,61,86)" mt={3}>Unauthorized User</Typography>
            </Box>
        </Grow>
    );
}

export default Unauthorized;
