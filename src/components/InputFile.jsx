import { DownloadDone, FileUploadOutlined } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import React from 'react';

const InputFile = ({ file, setFile, disabled }) => {
    const handleDrop = (e) => {
        e.preventDefault()
        setFile(e.dataTransfer.files[0]);
    }

    return (
        <Box
            tabIndex="0"
            border='2px dashed #B4B6B7'
            bgcolor="#F2F5F7"
            width="100%"
            height="250px"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            gap={1}
            borderRadius={1}
            onClick={() => !disabled && document.querySelector('#input-file').click()}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
        >
            {
                file ?
                    <>
                        <DownloadDone sx={{ width: '3rem', height: '3rem' }} color='disabled' />
                        <Typography variant='h5' color="InactiveCaptionText">File Attached Successfully!</Typography>
                    </>
                    :
                    <>
                        <FileUploadOutlined sx={{ width: '3rem', height: '3rem' }} color='disabled' />
                        <Typography variant='h5' color="InactiveCaptionText" sx={{ fontSize: { xs: 18, md: 24 } }}>Drag and drop file here</Typography>
                        <Typography variant='body2' mt={-1} color="InactiveCaptionText">or <span style={{ color: "#434CE6" }}>browse</span> file from device</Typography>
                    </>
            }
            <input

                id='input-file'
                name='file'
                type="file"
                accept='.ppt, .pptm, .pptx, .doc, .docx, .pdf, .jpg, .jpeg, .png, .txt'
                onChange={(e) => {
                    if (!e.target?.files[0]) return null;

                    setFile(e.target?.files[0])
                }}
                hidden
            />
        </Box>
    );
}

export default InputFile;
