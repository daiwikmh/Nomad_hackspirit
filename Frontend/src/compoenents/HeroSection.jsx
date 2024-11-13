import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import bgVideo from '../assets/video/video-1.mp4'
import TravelExpensePool from './group';
import ShowGroups from './show-groups';

function HeroSection() {
    let navigate = useNavigate();

    const routeChange = () => {
        let path = '/services';
        navigate(path);
    };

    return (
        <div className="relative h-screen flex flex-col justify-center items-center bg-black bg-opacity-50">
            <video className="absolute inset-0 w-full h-full object-cover z-[-1]" src={bgVideo} autoPlay loop muted />

            <h2 className="text-white text-[70px] sm:text-[50px] md:text-[70px] font-bold -mt-24 md:-mt-24">
                Empowering Solo Journeys
            </h2>
            <p className="text-white mt-2 text-[30px] md:text-[32px] font-sans">
                One Payment at a time
            </p>

            <TravelExpensePool />
            <ShowGroups />
        </div>
    );
}

export default HeroSection;
