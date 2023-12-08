import useAuth from './useAuth';
import axios from '../api/axios';
import useData from './useData';

const UseLogout = () => {
    const { setAuth } = useAuth();
    const { setUsers, setStudents, setLessons, setLessonsArchived, setStudentsArchived, setTabpage, setClasses, setClassesArchived } = useData();

    const logout = async () => {
        setAuth({});
        setStudents([])
        setUsers([])
        setLessons([])
        setLessons([])
        setLessonsArchived([])
        setStudentsArchived([])
        setClasses([])
        setClassesArchived([])
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
