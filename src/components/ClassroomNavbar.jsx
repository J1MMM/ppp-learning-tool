import { Box } from '@mui/material';
import React from 'react';
import { NavLink } from 'react-router-dom';

const ClassroomNavbar = () => {
    return (
        <Box
            paddingX={3}
            pr={5}
            mt={-2}
            ml={-2}
            bgcolor={'#FFF'}
            borderBottom={1}
            borderColor={'#E7EBF1'}
            display={'flex'}
            sx={{
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5,
            }}
        >
            <NavLink to="students" className={'classroom-navigation'}>Students</NavLink>
            <NavLink to="lessons" className={'classroom-navigation'}>Lessons</NavLink>
            <NavLink to="archive" className={'classroom-navigation'}>Archived</NavLink>
        </Box >
    );
}

export default ClassroomNavbar;
