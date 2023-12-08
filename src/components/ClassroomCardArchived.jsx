import { MoreVert } from '@mui/icons-material';
import { Box, Divider, Grow, IconButton, Menu, MenuItem, Paper, Typography } from '@mui/material';
import React, { useState } from 'react';


import banner1 from '../assets/images/banner1.jpg'
import banner2 from '../assets/images/banner2.svg'
import banner3 from '../assets/images/banner3.jpg'
import banner4 from '../assets/images/banner4.jpg'
import banner5 from '../assets/images/banner5.jpg'
import banner6 from '../assets/images/banner6.jpg'
import banner7 from '../assets/images/banner7.jpg'
import banner8 from '../assets/images/banner1.webp'
import banner9 from '../assets/images/banner9.jpg'
import banner10 from '../assets/images/banner10.jpg'
import ConfirmationDialog from './ConfirmationDialog';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useData from '../hooks/useData';
import { NavLink } from 'react-router-dom';

const banner = [banner1, banner2, banner3, banner4, banner5, banner6, banner7, banner8, banner9, banner10]

const ClassroomCardArchived = ({ item, setSnack, setSeverity, setResMsg }) => {

    const axiosPrivate = useAxiosPrivate();
    const { classesArchived, setClassesArchived } = useData()

    const [cardElevation, setCardElevation] = useState(3)
    const [anchorEl, setAnchorEl] = useState(null);
    const [achiveModal, setArchiveModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const open = Boolean(anchorEl)

    function stringToNumber(string) {
        let hash = 0;
        let i;

        for (i = 0; i < string.length; i += 1) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }

        // Ensure hash is positive (JavaScript doesn't have an unsigned int type)
        const positiveHash = hash >>> 0;

        // Map the hash value to the range of 1 to 8
        const mappedNumber = ((positiveHash % 10));
        return mappedNumber;
    }

    const schoolYearFormat = (date) => {
        const dateObject = new Date(date)

        const year = dateObject.getFullYear()
        return `S.Y. ${year}-${year + 1}`
    }

    const handleRestoreClass = async (id) => {
        setAnchorEl(null)
        try {
            const result = await axiosPrivate.patch('/class', { id, "toAchive": false })
            console.log(result.data);
            setClassesArchived(result.data?.filter(item => item.archive == true))
            setResMsg('Class Restored Successfully')
            setSeverity('success')
            setSnack(true)
        } catch (error) {
            setResMsg(error)
            setSeverity('error')
            setSnack(true)
            console.log(error);
        }
    }
    const handleDeleteClass = async (id) => {
        setAnchorEl(null)
        console.log(id);
        try {
            const result = await axiosPrivate.delete('/class', { data: { "id": id } })
            console.log(result.data);
            setClassesArchived(result.data?.filter(item => item.archive == true))
            setResMsg('Class Deleted Successfully')
            setSeverity('success')
            setSnack(true)
        } catch (error) {
            setResMsg(error)
            setSeverity('error')
            setSnack(true)
            console.log(error);
        }
    }


    return (
        <Grow in={true} >
            <Paper
                elevation={cardElevation}
                onMouseEnter={() => setCardElevation(5)}
                onMouseLeave={() => setCardElevation(3)}
                sx={{
                    width: '100%',
                    maxWidth: '280px',
                    height: '280px',
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: "column",
                    justifyContent: "space-between",
                    borderRadius: 3,
                    overflow: "hidden",
                    position: 'relative',
                    filter: 'grayscale(0.8)'
                }}
            >
                <NavLink to={`${item._id}`} style={{ textDecoration: 'none' }}>
                    <Box
                        position="relative"
                        width="100%"
                        height="100%"
                        maxHeight="120px"
                        overflow="hidden"
                        display="flex"
                        flexDirection="column"
                        p={2}
                        boxSizing="border-box"
                    >
                        <Typography component={'span'} variant='h6' zIndex={5} color="#FFF">{item?.section.length > 15 ? `${item?.section.slice(0, 12)}...` : item?.section}</Typography>
                        <Typography component={'span'} variant='caption' zIndex={5} color="#FFF">grade level {item?.gradeLevel}</Typography>
                        <Typography component={'span'} variant='caption' zIndex={5} color="#FFF">{schoolYearFormat(item?.schoolYear)}</Typography>

                        <img src={banner[stringToNumber(item._id)]} style={{ position: 'absolute', objectFit: 'cover', height: '100%', width: '100%', top: 0, left: 0, zIndex: 3, }} draggable="false" />
                        <Box bgcolor="black" position="absolute" height="100%" width="100%" top="0" left="0" sx={{ opacity: .3 }} zIndex={4} />
                    </Box>
                </NavLink>

                <IconButton
                    color='common'
                    size='large'
                    sx={{ position: 'absolute', top: 1, right: 1, zIndex: 10 }}
                    onClick={(e) => {
                        setAnchorEl(e.currentTarget);
                    }}
                >
                    <MoreVert />
                </IconButton>

                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={() => setAnchorEl(null)}
                >
                    <MenuItem onClick={() => setArchiveModal(true)}>Restore</MenuItem>
                    <MenuItem onClick={() => setDeleteModal(true)}>Delete</MenuItem>
                </Menu>

                <ConfirmationDialog
                    title={`Restore ${item?.section.length > 15 ? `${item?.section.slice(0, 12)}...` : item?.section}?`}
                    content='Restoring this class will bring back all associated data and make it accessible again. Are you sure you want to proceed?'
                    open={achiveModal}
                    setOpen={setArchiveModal}
                    confirm={() => handleRestoreClass(item._id)}
                />
                <ConfirmationDialog
                    title={`Delete ${item?.section.length > 15 ? `${item?.section.slice(0, 12)}...` : item?.section}?`}
                    content="You will no longer have access to any students or files that have been added to this class. You can't undo this action."
                    open={deleteModal}
                    setOpen={setDeleteModal}
                    confirm={() => handleDeleteClass(item._id)}
                />
            </Paper>

        </Grow >
    );
}

export default ClassroomCardArchived;
