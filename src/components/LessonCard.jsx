import { Block, Download, FileOpen, FolderOpen, FolderOpenRounded, FolderOpenSharp, MoreVert, OpenInFullRounded, ViewAgenda, ViewArray } from '@mui/icons-material';
import { Box, Button, Dialog, Divider, Grow, IconButton, Menu, MenuItem, Paper, Slide, Typography } from '@mui/material';
import React, { forwardRef, useState } from 'react';
import useAxios from '../hooks/useAxios';

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


const LessonCard =
    ({
        lesson,
        index,
        setEditLessonOpen,
        setLessonToEditID,
        handleEditLesson,
        setDeleteModal,
        setDeleteFilename,
        setDeleteID,
        handleViewFile,
        show,
    }) => {
        const axios = useAxios()
        const [cardElevation, setCardElevation] = useState(3)
        const [anchorEl, setAnchorEl] = useState(null);
        const open = Boolean(anchorEl)


        const banner = [banner1, banner2, banner3, banner4, banner5, banner6, banner7, banner8, banner9, banner10]

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

        const handleDownload = async (filename) => {
            try {
                const response = await axios.get(`/download/${filename}`, {
                    responseType: 'blob'
                })

                const url = window.URL.createObjectURL(new Blob([response.data]));
                // const url = lessons.downloadURL;
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                a.click();
                window.URL.revokeObjectURL(url);

                console.log(response);
            } catch (error) {
                console.log(error);
            }
        }



        return (
            <Grow in={show} >
                <Paper
                    elevation={cardElevation}
                    onMouseEnter={() => setCardElevation(5)}
                    onMouseLeave={() => setCardElevation(3)}
                    sx={{
                        width: '100%',
                        maxWidth: '300px',
                        height: '300px',
                        boxSizing: 'border-box',
                        display: 'flex',
                        flexDirection: "column",
                        justifyContent: "space-between",
                        borderRadius: 3,
                        overflow: "hidden",
                        position: 'relative',
                    }}
                >
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
                        <Typography variant='h6' zIndex={5} color="#FFF">{lesson.title}</Typography>
                        <Typography variant='caption' zIndex={5} color="#FFF">{lesson.fullname}</Typography>

                        <IconButton
                            color='common'
                            size='large'
                            sx={{ position: 'absolute', top: 1, right: 1, zIndex: 5 }}
                            onClick={(e) => setAnchorEl(e.currentTarget)}
                        >
                            <MoreVert />
                        </IconButton>

                        <img src={banner[stringToNumber(lesson._id)]} style={{ position: 'absolute', objectFit: 'cover', height: '100%', width: '100%', top: 0, left: 0, zIndex: 3, }} draggable="false" />
                        <Box bgcolor="black" position="absolute" height="100%" width="100%" top="0" left="0" sx={{ opacity: .3 }} zIndex={4} />
                    </Box>

                    <Box
                        // border="1px solid red"
                        display="flex"
                        justifyContent="flex-end"
                        alignItems="center"
                        p={1}
                        boxSizing="border-box"
                        position="relative"
                        gap={1}
                    >
                        <Divider sx={{ position: 'absolute', width: '100%', top: 0, left: 0 }} />

                        <Button size='small' onClick={() => handleDownload(lesson.filename)}>download</Button>
                        <Button size='small' onClick={() => handleViewFile(index)}>preview</Button>
                    </Box>

                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={() => setAnchorEl(null)}
                    >
                        <MenuItem onClick={() => { setEditLessonOpen(true); setLessonToEditID(lesson._id); handleEditLesson(lesson._id) }}>Edit</MenuItem>
                        <MenuItem onClick={() => { setDeleteModal(true); setDeleteID(lesson._id), setDeleteFilename(lesson.filename), setAnchorEl(null) }}>Delete</MenuItem>

                    </Menu>
                </Paper>
            </Grow >
        );
    }

export default LessonCard;
