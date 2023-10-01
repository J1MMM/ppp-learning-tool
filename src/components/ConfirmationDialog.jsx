import { Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Typography } from '@mui/material';
import React from 'react';

const ConfirmationDialog = ({ open, setOpen, title, content, confirm }) => {
    return (
        <Dialog
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title" variant='h5' fontWeight="500">
                {title}
            </DialogTitle>
            <Divider />
            <DialogContent >
                <DialogContentText id="alert-dialog-description">
                    <Alert severity='warning' sx={{ maxWidth: '400px' }} >
                        <Typography variant='body1'>{content}</Typography>
                    </Alert>
                </DialogContentText>
            </DialogContent>
            <DialogActions >
                <Button size='small' onClick={() => setOpen(false)} sx={{ color: 'InactiveCaptionText' }}>Cancel</Button>
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
