import { Alert, Snackbar } from '@mui/material';
import React from 'react';

const SnackBar = ({ open, onClose, severity, msg, position }) => {
    return (
        <div>
            <Snackbar
                open={open}
                autoHideDuration={5000}
                onClose={() => onClose(false)}
                anchorOrigin={position || { horizontal: 'right', vertical: 'bottom' }}

            >
                <Alert
                    onClose={() => onClose(false)}
                    severity={severity}
                    variant='filled'
                    sx={{ width: '100%' }}
                >{msg}</Alert>
            </Snackbar>
        </div>
    );
}

export default SnackBar;
