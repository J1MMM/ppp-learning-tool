import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import LoginSlides from './LoginSlides';
import { Box } from '@mui/material';
import img1 from '../assets/images/login-slide1.svg'
import img2 from '../assets/images/login-slide2.svg'
import img3 from '../assets/images/login-slide3.svg'
import { useParams } from 'react-router-dom';


const SwiperComp = () => {
    const { id } = useParams();

    console.log(id);

    const slides = [
        {
            img: img1,
            title: "Online Learning Tools for Educators in PPP",
            sub: "New Approach to Kids Education"
        },
        {
            img: img2,
            title: "Enhance Teaching Workflow with Efficient Lesson Management",
            sub: "Discover Powerful Tools to Create, Organize, and Deliver Engaging Educational Content"
        },
        {
            img: img3,
            title: "Ensuring Your Online Safety",
            sub: "Experience a Secure and Trustworthy Learning Environment"
        },
    ]
    const slideEl = slides.map((item, index) => {
        return (
            <SwiperSlide key={index}>
                <LoginSlides img={item.img} title={item.title} sub={item.sub} />
            </SwiperSlide>
        )
    })
    return (
        <Box
            border="1px solid red"
            height="50vh"
            width="50vw"
            margin="auto"
            position="relative"
        >
            <Swiper
                spaceBetween={30}
                centeredSlides={true}
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                }}
                modules={[Autoplay, Pagination, Navigation]}
                className="mySwiper"

            >
                {slideEl}
            </Swiper>

        </Box>
    );
}

export default SwiperComp;
