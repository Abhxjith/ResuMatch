"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { inter } from "../../lib/fonts";

export default function HowItWorks() {
    const [activeStep, setActiveStep] = useState(0);

    const steps = [
        {
            id: "01",
            title: "upload resume",
            desc: "start by uploading your resume",
            img: "/run.png"
        },
        {
            id: "02",
            title: "upload job details",
            desc: "start by uploading your resume",
            img: "/clap.png"
        },
        {
            id: "03",
            title: "get matched",
            desc: "start by uploading your resume",
            img: "/bee.png"
        }
    ];

    useEffect(() => {
        const handleScroll = () => {
            const stepElements = document.querySelectorAll(".step-container");
            const container = document.getElementById("how-it-works-scroll");
            
            if (!container) return;
            const containerRect = container.getBoundingClientRect();
            
            let currentIdx = 0;
            stepElements.forEach((el, index) => {
                const rect = el.getBoundingClientRect();
                // When element gets into the upper middle section of viewport
                if (rect.top <= window.innerHeight * 0.45) {
                    currentIdx = index;
                }
            });
            setActiveStep(currentIdx);
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <section id="how-it-works" className={`w-full max-w-6xl mx-auto mt-40 mb-10 relative ${inter.className}`}>

            {/* Heading */}
            <div className="w-full flex justify-center mb-24">
                <h2 className="flex items-center gap-4 text-[42px] leading-tight font-medium tracking-tight text-[#111]">
                    <div className="w-[50px] h-[50px] -mt-1">
                        <Image src="/bee.png" alt="bee icon" width={80} height={80} className="w-full h-full object-contain mix-blend-multiply" />
                    </div>
                    How does ResuMatch work?
                </h2>
            </div>

            {/* Two Column Layout */}
            <div id="how-it-works-scroll" className="flex flex-col md:flex-row relative max-w-5xl mx-auto pb-10 md:pb-[15vh]">

                {/* Left Side: Sticky Image & Indicator */}
                <div className="w-full md:w-1/2 md:sticky top-[15vh] h-auto md:h-[60vh] flex items-center justify-center md:justify-end pr-0 md:pr-12 lg:pr-20 mb-16 md:mb-0 self-start">

                    <div className="flex items-start gap-10">
                        {/* Image Box */}
                        <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] rounded-[3rem] border border-[#aaeac3] bg-white flex items-center justify-center transition-all duration-500 overflow-hidden shadow-sm">
                            {steps.map((step, i) => (
                                <div
                                    key={i}
                                    className={`absolute inset-0 flex items-center justify-center ${activeStep === i ? "opacity-100" : "opacity-0"}`}
                                >
                                    <Image
                                        src={step.img}
                                        alt={step.title}
                                        className="object-contain p-12 mix-blend-multiply"
                                        fill
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Progress Indicators */}
                        <div className="hidden md:flex flex-col items-center gap-2 pt-12">
                            {steps.map((_, i) => (
                                <div
                                    key={i}
                                    className={`transition-all duration-300 ${activeStep === i
                                        ? "w-3 h-[5rem] rounded-full bg-[#3bda71] shadow-[0_0_15px_rgba(59,218,113,0.4)]"
                                        : "w-3 h-3 rounded-full bg-[#d0d0d0]"
                                        }`}
                                />
                            ))}
                        </div>
                    </div>

                </div>

                {/* Right Side: Scrollable Steps structured tightly */}
                <div className="w-full md:w-1/2 pl-4 md:pl-10 lg:pl-12 flex flex-col justify-center gap-16 md:gap-[9rem] pb-[20vh] md:pb-[30vh]">
                    {steps.map((step, i) => (
                        <div
                            key={i}
                            className={`step-container w-full max-w-[400px] flex flex-col justify-center transition-all duration-500 ease-in-out ${activeStep === i 
                                ? "opacity-100 transform scale-100" 
                                : "opacity-30 transform scale-[0.9] origin-left"
                                }`}
                        >
                            <div
                                className={`w-14 h-14 rounded-full flex items-center justify-center text-[18px] font-medium mb-6 transition-all duration-500 ${activeStep === i ? "bg-[#cbf4d8] text-black shadow-sm" : "border-2 border-[#eaeaea] text-[#999]"
                                    }`}
                            >
                                {step.id}
                            </div>
                            <h3 className={`text-[32px] md:text-[36px] font-medium mb-3 tracking-[-0.02em] transition-colors duration-500 ${activeStep === i ? "text-[#111]" : "text-[#777]"}`}>{step.title}</h3>
                            <p className={`text-[16px] md:text-[18px] font-medium leading-[1.4] tracking-tight max-w-sm ${activeStep === i ? "text-[#666]" : "text-[#999]"}`}>{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
