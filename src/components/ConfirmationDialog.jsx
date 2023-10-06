import { Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Typography } from '@mui/material';
import React from 'react';

const ConfirmationDialog = ({ open, setOpen, title, content, confirm }) => {
    return (
        <Dialog
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            component={'span'}
        >
            <DialogTitle component={'span'} id="alert-dialog-title" variant='h5' fontWeight="500">
                {title}
            </DialogTitle>
            <Divider />
            <DialogContent component={'span'} >
                <DialogContentText component={'span'} id="alert-dialog-description">
                    <Alert component={'span'} severity='warning' sx={{ maxWidth: '400px' }} >
                        <Typography component={'span'} variant='body1'>{content}</Typography>
                    </Alert>
                </DialogContentText>
            </DialogContent>
            <DialogActions component={'span'} >
                <Button component={'span'} size='small' onClick={() => setOpen(false)} sx={{ color: 'InactiveCaptionText' }}>Cancel</Button>
                <Button
                    component={'span'}
                    autoFocus
                    size='small'
                    onClick={() => {
                        setOpen(false)
                        confirm()
                    }}
                    color='warning'>
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ConfirmationDialog;
