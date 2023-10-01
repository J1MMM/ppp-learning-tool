import { Description, MoreVert, OndemandVideo } from '@mui/icons-material';
import { Box, Button, Chip, Divider, Grow, IconButton, Menu, MenuItem, Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import useAxios from '../hooks/useAxios';
import { BsFilePdf, BsFiletypeDoc, BsFiletypeDocx, BsFiletypeJpg, BsFiletypePng, BsFiletypePpt, BsFiletypePptx, BsPaperclip } from "react-icons/bs";

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
import UserAvatar from './UserAvatar';
import { BiBrain, BiPencil, BiSolidPencil } from "react-icons/bi";


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
                        <Typography variant='h6' zIndex={5} color="#FFF">{lesson.title.length > 18 ? `${lesson.title.slice(0, 18)}...` : lesson.title}</Typography>
                        <Typography variant='caption' zIndex={5} color="#FFF">{lesson.instructor}</Typography>

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
                        width="100%"
                        height="100%"
                        position="relative"
                        boxSizing="border-box"
                        p={1}
                    >
                        {/* <Box
                            // bgcolor='primary.main'
                            display="flex"
                            alignItems="center"
                            borderRadius={1}
                            boxSizing="border-box"
                            p={1}
                            gap={.5}
                        >
                            {lesson.fileType == "mp4" ?
                                <OndemandVideo color='primary' /> :
                                lesson.fileType == "ppt" ?
                                    <BsFiletypePpt size={18} color='#2DA544' /> :
                                    lesson.fileType == "pptx" ?
                                        <BsFiletypePptx size={18} color='#2DA544' /> :
                                        lesson.fileType == "doc" ?
                                            <BsFiletypeDoc size={18} color='#2DA544' /> :
                                            lesson.fileType == "docx" ?
                                                <BsFiletypeDocx size={18} color='#2DA544' /> :
                                                lesson.fileType == "pdf" ?
                                                    <BsFilePdf size={18} color='#2DA544' /> :
                                                    lesson.fileType == "jpg" ?
                                                        <BsFiletypeJpg size={18} color='#2DA544' /> :
                                                        lesson.fileType == "png" ?
                                                            <BsFiletypePng size={18} color='#2DA544' /> :
                                                            <BsPaperclip size={18} color='#2DA544' />

                            }

                            <Typography variant='caption' color="primary.main">{lesson.fileName.length > 20 ? `${lesson.fileName.slice(0, 20)}...` : lesson.fileName}</Typography>
                        </Box> */}

                        <Box
                            display="flex"
                            alignItems="center"
                            borderRadius={1}
                            boxSizing="border-box"
                            p={1}
                            gap={1}
                        >
                            <Typography variant='caption' sx={{ color: 'InactiveCaptionText' }} >
                                Tags:
                            </Typography>
                            {lesson.categories.map((item, index) => {
                                return <Chip label={item} key={index} size='small' sx={{ color: item == 'Dyslexia' ? '#BF2011' : item == 'Dysgraphia' ? '#7F56D9' : '#0FC06B', fontSize: 'x-small', fontWeight: 'bold' }} />
                            })}
                        </Box>

                    </Box>

                    {/* <Box
                        // border="1px solid red"
                        height="100%"
                        width="100%"
                        position="relative"
                    >
                        <Box position="absolute" top={-35} right={20} >
                            <UserAvatar fullname={lesson.instructor} height={70} width={70} border={"3px solid #FFF"} />
                        </Box>
                    </Box> */}

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

                        <Button sx={{ color: 'InactiveCaptionText' }} size='small' onClick={() => handleDownload(lesson.fileName, lesson.uri)}>download</Button>
                        <Button size='small' onClick={() => handleViewFile(index)}>preview</Button>
                    </Box>

                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={() => setAnchorEl(null)}
                    >
                        <MenuItem onClick={() => { setEditLessonOpen(true); setLessonToEditID(lesson._id); handleEditLesson(lesson._id) }}>Edit</MenuItem>
                        <MenuItem onClick={() => { setDeleteModal(true); setDeleteID(lesson._id), setDeleteFilename(lesson.filePath), setAnchorEl(null) }}>Delete</MenuItem>

                    </Menu>
                </Paper>
            </Grow >
        );
    }

export default LessonCard;
