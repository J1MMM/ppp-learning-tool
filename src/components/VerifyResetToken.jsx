import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation, useParams } from 'react-router-dom';
import axios from '../api/axios';

const VerifyResetToken = () => {
    const location = useLocation()
    const { token } = useParams()
    const [allowed, setAllowed] = useState(true)

    useEffect(() => {
        let isMounted = true;

        const checkToken = async () => {
            try {
                const response = await axios.post(`/reset-password/${token}`)
                console.log(response.status);

                if (response.status == 200) {
                    isMounted && setAllowed(true)
                }
            } catch (error) {
                isMounted && setAllowed(false)
                console.log(error.message);
            }
        }

        checkToken();
        return () => isMounted = false
    }, [])


    return (
        allowed ? <Outlet /> : <Navigate to="/" state={{ from: location }} replace />
    );
}

export default VerifyResetToken;
