import { Box, Paper, Typography } from '@mui/material';
import React from 'react';

const OverviewCard = ({ index, data }) => {
    return (
        <Paper
            elevation={2}
            sx={{
                borderRadius: 2,
                minWidth: 300,
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                bgcolor: index == 0 ? "primary.main" : "#FFF",
                position: 'relative'
            }}

        >
            <Box display="flex" alignItems="center" justifyContent="space-between" zIndex="5">
                <Box display="flex" alignItems="center">
                    <Typography variant='h6' color={index == 0 ? "#FFF" : "InactiveCaptionText"}>{data.title}</Typography>

                </Box>
                <Box bgcolor={index == 0 ? "rgba(225,225,225,.3)" : "#ECEDFC"} borderRadius="50%" width={40} height={40} display="flex" alignItems="center" justifyContent="center" >
                    {data.icon}
                </Box>
            </Box>
            <Typography variant='h4' mt={3} fontWeight="500" color={index == 0 ? "#FFF" : "#000"}>{data.data.toLocaleString()}</Typography>
            <Typography variant='caption' mt={"auto"} color={index == 0 ? "#FFF" : "InactiveCaptionText"}>{data.subText}</Typography>
        </Paper >
    );
}

export default OverviewCard;
