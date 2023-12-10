import React, { createContext, useState } from 'react';

const DataContext = createContext({})

export const DataProvider = ({ children }) => {
    const [users, setUsers] = useState([])
    const [students, setStudents] = useState([])
    const [lessons, setLessons] = useState([])
    const [classes, setClasses] = useState([])
    const [classesArchived, setClassesArchived] = useState([])
    const [studentsArchived, setStudentsArchived] = useState([])
    const [lessonsArchived, setLessonsArchived] = useState([])
    const [userArchived, setUserArchived] = useState([])
    const [allStudents, setAllStudents] = useState([])

    const [archiveMode, setArchiveMode] = useState(false)
    const [currentSection, setCurrentSection] = useState("")

    const [tabPage, setTabpage] = useState(0);

    return (
        <DataContext.Provider value={{
            users,
            setUsers,
            students,
            setStudents,
            lessons,
            setLessons,
            tabPage,
            setTabpage,
            studentsArchived,
            setStudentsArchived,
            lessonsArchived,
            setLessonsArchived,
            userArchived,
            setUserArchived,
            classes,
            setClasses,
            setClassesArchived,
            classesArchived,
            allStudents,
            setAllStudents,
            archiveMode,
            setArchiveMode,
            setCurrentSection,
            currentSection
        }}>
            {children}
        </DataContext.Provider>
    );
}

export default DataContext;
