import React, { createContext, useState } from 'react';

const DataContext = createContext({})

export const DataProvider = ({ children }) => {
    const [users, setUsers] = useState([])
    const [students, setStudents] = useState([])
    const [lessons, setLessons] = useState([])
    const [studentsArchived, setStudentsArchived] = useState([])
    const [lessonsArchived, setLessonsArchived] = useState([])

    const [tabPage, setTabpage] = useState(0);

    return (
        <DataContext.Provider value={{ users, setUsers, students, setStudents, lessons, setLessons, tabPage, setTabpage, studentsArchived, setStudentsArchived, lessonsArchived, setLessonsArchived }}>
            {children}
        </DataContext.Provider>
    );
}

export default DataContext;
