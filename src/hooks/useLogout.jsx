import useAuth from './useAuth';
import axios from '../api/axios';
import useData from './useData';

const UseLogout = () => {
    const { setAuth } = useAuth();
    const { setUsers, setStudents, setLessons } = useData();

    const logout = async () => {
        setAuth({});
        setStudents([])
        setUsers([])
        setLessons([])
        try {
            const response = axios('/logout', {
                withCredentials: true
            })
        } catch (error) {
            console.error(error);
        }

    }

    return logout
}

export default UseLogout;
