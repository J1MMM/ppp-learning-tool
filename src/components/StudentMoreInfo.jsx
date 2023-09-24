import { Box, Dialog, DialogContent, DialogTitle, Divider } from '@mui/material';
import React from 'react';

const StudentMoreInfo = ({ active, setActive }) => {
    return (
        <Dialog open={active} onClose={() => setActive(false)} >
            <DialogTitle bgcolor="primary.main" color="#FFF">Details</DialogTitle>
            <Divider />
            <DialogContent>
                <Box>

                </Box>
            </DialogContent>
        </Dialog>
    );
}

export default StudentMoreInfo;
