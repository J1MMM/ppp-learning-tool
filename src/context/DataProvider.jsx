import React, { createContext, useState } from 'react';

const DataContext = createContext({})

export const DataProvider = ({ children }) => {
    const [users, setUsers] = useState([])
    const [students, setStudents] = useState([])
    const [lessons, setLessons] = useState([])

    return (
        <DataContext.Provider value={{ users, setUsers, students, setStudents, lessons, setLessons }}>
            {children}
        </DataContext.Provider>
    );
}

export default DataContext;
