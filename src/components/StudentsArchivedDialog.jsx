import { VisibilityOff } from '@mui/icons-material';
import { Box, Checkbox, Dialog, DialogContent, DialogTitle, Divider, FormControl, FormControlLabel, FormGroup, FormLabel, IconButton, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import React from 'react';

const StudentsArchivedDialog = ({ open, onClose, disabilities, infoFname, infoLname, infoMname, infoAddress, infoAge, infoContactNo, infoDoB, infoEmail, infoGender, infoGuardian }) => {

    const { dyslexia, dysgraphia, dyscalculia } = disabilities;

    return (
        <Dialog open={open} onClose={() => onClose(false)} disableAutoFocus>
            <DialogTitle variant='h5' bgcolor="primary.main" color="#FFF" >Details</DialogTitle>
            <Divider />
            <DialogContent>
                <Box
                    display="flex"
                    gap={1}
                    sx={{
                        flexDirection: {
                            xs: "column",
                            sm: "row"
                        }
                    }}
                >
                    <TextField
                        disabled
                        required
                        autoFocus
                        margin="dense"
                        id="fname"
                        label="First name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={infoFname}
                        inputProps={{ readOnly: true }}
                    />
                    <TextField
                        disabled
                        margin="dense"
                        id="lname"
                        label="Last name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={infoLname}
                        inputProps={{ readOnly: true }}
                    />
                    <TextField
                        disabled
                        margin="dense"
                        id="mname"
                        label="Middle name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={infoMname}
                        inputProps={{ readOnly: true }}
                    />
                </Box>

                <TextField
                    disabled
                    margin="dense"
                    id="address"
                    label="Address"
                    type="text"
                    variant="outlined"
                    value={infoAddress}
                    fullWidth
                    inputProps={{ readOnly: true }}
                />

                <Box
                    mt={1}
                    display="flex"
                    gap={2}
                    sx={{
                        flexDirection: {
                            xs: "column",
                            sm: "row"
                        }
                    }}

                >
                    <FormControl fullWidth margin='dense' disabled>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker label="Date of birth" value={infoDoB} disabled readOnly={true} />
                        </LocalizationProvider>
                    </FormControl>

                    <FormControl fullWidth margin='dense' disabled>
                        <InputLabel id="gender">Gender</InputLabel>
                        <Select
                            labelId="gender"
                            id="gender"
                            value={infoGender}
                            label="Gender"
                            inputProps={{ readOnly: true }}
                        >
                            <MenuItem value={"male"}>Male</MenuItem>
                            <MenuItem value={"female"}>Female</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        disabled
                        margin="dense"
                        id="contactNo"
                        label="Phone number"
                        type='text'
                        variant="outlined"
                        fullWidth
                        value={infoContactNo}
                        inputProps={{ readOnly: true }}
                    />
                </Box>
                <Box
                    mt={1}
                    display="flex"
                    gap={2}
                    sx={{
                        flexDirection: {
                            xs: "column",
                            sm: "row"
                        }
                    }}
                >

                    <TextField
                        disabled
                        margin="dense"
                        id="age"
                        label="Age"
                        type='text'
                        variant="outlined"
                        fullWidth
                        value={infoAge}
                        inputProps={{ readOnly: true }}
                        focused={false}

                    />

                    <TextField
                        disabled
                        margin="dense"
                        id="guardian"
                        label="Parent/Guardian"
                        type='text'
                        variant="outlined"
                        fullWidth
                        value={infoGuardian}
                        inputProps={{ readOnly: true }}
                    />
                </Box>

                <Box
                    mt={1}
                    display='flex'
                    gap={2}
                    sx={{
                        flexDirection: {
                            xs: "column",
                            sm: "row"
                        }
                    }}
                >
                    <TextField
                        disabled
                        margin="dense"
                        id="email"
                        label="Email Address"
                        type="email"
                        variant="outlined"
                        fullWidth
                        value={infoEmail}
                        inputProps={{ readOnly: true }}
                    />

                    <FormControl fullWidth variant="outlined" margin='dense'>
                        <InputLabel htmlFor="password">Password</InputLabel>
                        <OutlinedInput
                            disabled
                            id="pwd"
                            type={'password'}
                            inputProps={{ readOnly: true }}
                            endAdornment={
                                <InputAdornment position="end" >
                                    <IconButton
                                        disabled
                                        edge="end"
                                    >
                                        <VisibilityOff />
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Password"
                        />
                    </FormControl>


                </Box>

                <FormControl sx={{ mt: 2 }} >
                    <FormLabel component="legend" disabled>Learning Disabilities:</FormLabel>
                    <FormGroup >
                        <FormControlLabel
                            sx={{ width: 'fit-content' }}
                            control={
                                <Checkbox disabled checked={dyslexia} name='dyslexia' />
                            }
                            label="Dyslexia" />

                        <FormControlLabel
                            sx={{ width: 'fit-content' }}
                            control={
                                <Checkbox disabled checked={dysgraphia} name='dysgraphia' />
                            }
                            label="Dysgraphia" />

                        <FormControlLabel
                            sx={{ width: 'fit-content' }}
                            control={
                                <Checkbox disabled checked={dyscalculia} name='dyscalculia' />
                            }
                            label="Dyscalculia" />
                    </FormGroup>
                </FormControl>
            </DialogContent>
        </Dialog>
    );
}

export default StudentsArchivedDialog;
