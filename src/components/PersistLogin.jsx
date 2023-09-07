import React, { useEffect, useState } from 'react';
import UseRefreshToken from '../hooks/useRefreshToken';
import useAuth from '../hooks/useAuth';
import { Outlet } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import { Box } from '@mui/material';

const PersistLogin = () => {
    const [isLoading, setIsLoading] = useState(true)
    const refresh = UseRefreshToken();
    const { auth } = useAuth();

    useEffect(() => {
        const verifyRefreshToken = async () => {
            try {
                await refresh();
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false)
            }
        }


        !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);

    }, [])

    useEffect(() => {
        // console.log(`isLoading: ${isLoading}`);
        // console.log(`AcessToken:  ${JSON.stringify(auth?.accessToken)}`);
    }, [isLoading])

    return (
        <>
            {isLoading ?
                <Box sx={{ display: 'flex', width: '100%', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
                    <CircularProgress size={50} />
                </Box>
                : <Outlet />

            }
        </>
    );
}

export default PersistLogin;
