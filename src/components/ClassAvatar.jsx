import { Avatar } from '@mui/material';
import React from 'react';

const ClassAvatar = ({ fullname, height, width, variant, border, fontSize }) => {
    const aHeight = height || '40px'
    const aWidth = width || '40px'

    function stringToColor(string) {
        let hash = 0;
        let i;

        /* eslint-disable no-bitwise */
        for (i = 0; i < string.length; i += 1) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }

        let color = '#';

        for (i = 0; i < 3; i += 1) {
            const value = (hash >> (i * 8)) & 0xff;
            color += `00${value.toString(16)}`.slice(-2);
        }
        /* eslint-enable no-bitwise */

        return color;
    }

    function stringAvatar(name) {
        function formatFullName(fullName) {
            // Remove extra spaces and split the name into words
            const words = fullName.replace(/\s+/g, ' ').trim().split(' ');

            // Capitalize the first letter of each word
            const formattedWords = words.map((word) => {
                return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            });

            // Join the formatted words with a space to create the formatted full name
            return formattedWords.join(' ');
        }

        const formattedFullname = formatFullName(name)

        return {
            sx: {
                bgcolor: stringToColor(name),
                fontSize: fontSize,
                width: aWidth,
                height: aHeight,
                fontFamily: 'Poppins, sans-serif',
                zIndex: 5,
                border: border

            },
            children: `${formattedFullname.split(' ')[0][0]}`,
        };
    }

    return (
        <Avatar variant={variant} {...stringAvatar(fullname)} />
    )
}

export default ClassAvatar;
