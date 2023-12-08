import { Description, MoreVert, OndemandVideo } from '@mui/icons-material';
import { Box, Button, Chip, Divider, Grow, IconButton, Menu, MenuItem, Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import useAxios from '../hooks/useAxios';
import { BsFilePdf, BsFiletypeDoc, BsFiletypeDocx, BsFiletypeJpg, BsFiletypePng, BsFiletypePpt, BsFiletypePptx, BsPaperclip } from "react-icons/bs";

import banner1 from '../assets/images/lesson1.jpg'
import banner2 from '../assets/images/lesson2.jpg'
import banner3 from '../assets/images/lesson3.jpg'
import banner4 from '../assets/images/lesson4.webp'
import banner5 from '../assets/images/lesson5.jpg'
import banner6 from '../assets/images/lesson6.webp'
import banner7 from '../assets/images/lesson7.png'
import banner8 from '../assets/images/lesson8.jpg'
import banner9 from '../assets/images/lesson9.jpg'
import banner10 from '../assets/images/lesson10.jpg'
import UserAvatar from './UserAvatar';
import { BiBrain, BiPencil, BiSolidPencil } from "react-icons/bi";
import { VscBook } from 'react-icons/vsc';
import { MdOutlineDraw } from 'react-icons/md';
import { GoNumber } from 'react-icons/go';
import useData from '../hooks/useData';


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
        mode
    }) => {
        const { archiveMode } = useData()
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

        const handleDownload = async (filename, url) => {
            try {
                const response = await fetch(url);
                const blob = await response.blob();

                // Create a temporary URL for the blob
                const blobUrl = URL.createObjectURL(blob);

                // Create an anchor element to trigger the download
                const a = document.createElement('a');
                a.href = blobUrl;
                a.download = filename; // Set the desired file name
                a.style.display = 'none';

                // Append the anchor element to the body and trigger the download
                document.body.appendChild(a);
                a.click();

                // Clean up
                document.body.removeChild(a);
                URL.revokeObjectURL(blobUrl);
            } catch (error) {
                console.error('Error downloading file:', error);
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
                        maxWidth: '280px',
                        height: '280px',
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
                        <Typography component={'span'} variant='h6' zIndex={5} color="#FFF">{lesson.title.length > 18 ? `${lesson.title.slice(0, 18)}...` : lesson.title}</Typography>
                        <Typography component={'span'} variant='caption' zIndex={5} color="#FFF">{lesson.instructor}</Typography>

                        <IconButton
                            disabled={archiveMode}
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
                        width="100%"
                        height="100%"
                        position="relative"
                        boxSizing="border-box"
                        p={1}
                    >

                        <Box
                            display="flex"
                            alignItems="center"
                            borderRadius={1}
                            boxSizing="border-box"
                            p={1}
                            gap={1}
                        >
                            <Typography component={'span'} variant='caption' sx={{ color: 'InactiveCaptionText' }} >
                                Tags:
                            </Typography>
                            {lesson.categories.map((item, index) => {
                                switch (item) {
                                    case 'Dyslexia':
                                        return (
                                            <Box key={index} bgcolor={'#f9e8fa'} display={'flex'} justifyContent={'center'} alignItems={'center'} p={1} borderRadius={'50%'} boxSizing={'border-box'} >
                                                <VscBook color='#F75FFF' size={16} />
                                            </Box>
                                        )
                                        break;
                                    case 'Dysgraphia':
                                        return (
                                            <Box key={index} bgcolor={'#d9e2ff'} display={'flex'} justifyContent={'center'} alignItems={'center'} p={1} borderRadius={'50%'} boxSizing={'border-box'} >
                                                <MdOutlineDraw color='#3760E3' size={16} />
                                            </Box>
                                        )
                                        break;
                                    case 'Dyscalculia':
                                        return (
                                            <Box key={index} bgcolor={'#f7fff8'} display={'flex'} justifyContent={'center'} alignItems={'center'} p={1} borderRadius={'50%'} boxSizing={'border-box'} >
                                                <GoNumber color='#00C914' size={16} />
                                            </Box>
                                        )
                                        break;
                                }
                            })}
                        </Box>

                    </Box>

                    <Box
                        display="flex"
                        justifyContent="flex-end"
                        alignItems="center"
                        p={1}
                        boxSizing="border-box"
                        position="relative"
                        gap={1}
                    >
                        <Divider sx={{ position: 'absolute', width: '100%', top: 0, left: 0 }} />

                        <Button size='small' onClick={() => handleDownload(lesson.fileName, lesson.uri)}>download</Button>
                        <Button size='small' onClick={() => handleViewFile(index)}>preview</Button>
                    </Box>

                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={() => setAnchorEl(null)}
                    >
                        <MenuItem onClick={() => { setEditLessonOpen(true); setLessonToEditID(lesson._id); handleEditLesson(lesson._id) }}>Edit</MenuItem>
                        <MenuItem onClick={() => { setDeleteModal(true); setDeleteID(lesson._id), setDeleteFilename(lesson.filePath), setAnchorEl(null) }}>{mode == 'archive' ? 'Archive' : 'Delete'}</MenuItem>

                    </Menu>
                </Paper>
            </Grow >
        );
    }

export default LessonCard;
