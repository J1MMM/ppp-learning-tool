import { Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider } from '@mui/material';
import React from 'react';

const ConfirmationDialog = ({ open, setOpen, title, content, confirm }) => {
    return (
        <Dialog
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title" variant='h6' fontWeight="500">
                {title}
            </DialogTitle>
            <Divider />
            <DialogContent >
                <DialogContentText id="alert-dialog-description">
                    <Alert severity='warning' sx={{ maxWidth: '400px' }}>
                        {content}
                    </Alert>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button size='small' onClick={() => setOpen(false)} color='secondary'>Cancel</Button>
                <Button
                    autoFocus
                    size='small'
                    onClick={() => {
                        setOpen(false)
                        confirm()
                    }}
                    color='error'>
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ConfirmationDialog;
