import React, { useEffect } from 'react';
import UseRefreshToken from './useRefreshToken';
import useAuth from './useAuth';
import axios from '../api/axios';

const useAxios = () => {
    const refresh = UseRefreshToken();
    const { auth } = useAuth();

    useEffect(() => {
        const requestIntercept = axios.interceptors.request.use(
            config => {
                if (!config?.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${auth.accessToken}`
                }
                return config;
            }, (error) => Promise.reject(error)
        )

        const responseIntercept = axios.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config;

                if (error?.response?.status === 403 && !prevRequest?.sent) {
                    prevRequest.sent = true;
                    const newAccessToken = refresh();

                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`

                    return axios(prevRequest)
                }
                return Promise.reject(error)
            }
        )

        return () => {
            axios.interceptors.request.eject(requestIntercept)
            axios.interceptors.response.eject(responseIntercept)
        }
    }, [auth, refresh])

    return axios;
}

export default useAxios;
