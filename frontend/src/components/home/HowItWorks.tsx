"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { BlurredStagger } from "../ui/blurred-stagger-text";
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
        <motion.section
            id="how-it-works"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className={`w-full max-w-6xl mx-auto mt-20 sm:mt-28 md:mt-40 mb-8 md:mb-10 relative px-2 sm:px-4 ${inter.className}`}
        >

            {/* Heading */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="w-full flex justify-center mb-24"
            >
                <h2 className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-[28px] sm:text-[36px] md:text-[42px] leading-tight font-medium tracking-tight text-[#111] text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                        className="w-[50px] h-[50px] -mt-1"
                    >
                        <Image src="/bee.png" alt="bee icon" width={80} height={80} className="w-full h-full object-contain mix-blend-multiply" />
                    </motion.div>
                    <BlurredStagger text="How does ResuMatch work?" as="span" inView staggerChildren={0.03} letterDuration={0.5} className="inline" />
                </h2>
            </motion.div>

            {/* Two Column Layout */}
            <div id="how-it-works-scroll" className="flex flex-col md:flex-row relative max-w-5xl mx-auto pb-10 md:pb-[15vh]">

                {/* Left Side: Sticky Image & Indicator */}
                <div className="w-full md:w-1/2 md:sticky top-[15vh] h-auto md:h-[60vh] flex items-center justify-center md:justify-end pr-0 md:pr-12 lg:pr-20 mb-16 md:mb-0 self-start">

                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                        className="flex items-start gap-10"
                    >
                        {/* Image Box */}
                        <div className="relative w-[240px] h-[240px] sm:w-[300px] sm:h-[300px] md:w-[400px] md:h-[400px] rounded-[2rem] sm:rounded-[3rem] border border-[#aaeac3] bg-white flex items-center justify-center transition-all duration-700 overflow-hidden shadow-sm mx-auto">
                            {steps.map((step, i) => (
                                <div
                                    key={i}
                                    className={`absolute inset-0 flex items-center justify-center ${activeStep === i ? "opacity-100" : "opacity-0"}`}
                                >
                                    <Image
                                        src={step.img}
                                        alt={step.title}
                                        className="object-contain p-6 sm:p-10 md:p-12 mix-blend-multiply"
                                        fill
                                        sizes="(max-width: 640px) 240px, (max-width: 768px) 300px, 400px"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Progress Indicators */}
                        <div className="hidden md:flex flex-col items-center gap-2 pt-12">
                            {steps.map((_, i) => (
                                <motion.div
                                    key={i}
                                    layout
                                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                    className={`${activeStep === i
                                        ? "w-3 h-[5rem] rounded-full bg-[#3bda71] shadow-[0_0_15px_rgba(59,218,113,0.4)]"
                                        : "w-3 h-3 rounded-full bg-[#d0d0d0]"
                                        }`}
                                />
                            ))}
                        </div>
                    </motion.div>

                </div>

                {/* Right Side: Scrollable Steps structured tightly */}
                <div className="w-full md:w-1/2 pl-2 sm:pl-4 md:pl-10 lg:pl-12 flex flex-col justify-center gap-12 sm:gap-16 md:gap-[9rem] pb-[12vh] sm:pb-[20vh] md:pb-[30vh]">
                    {steps.map((step, i) => (
                        <div
                            key={i}
                            className={`step-container w-full max-w-[400px] flex flex-col justify-center transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${activeStep === i 
                                ? "opacity-100 transform scale-100" 
                                : "opacity-30 transform scale-[0.9] origin-left"
                                }`}
                        >
                            <motion.div
                                layout
                                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                className={`w-14 h-14 rounded-full flex items-center justify-center text-[18px] font-medium mb-6 ${activeStep === i ? "bg-[#cbf4d8] text-black shadow-sm" : "border-2 border-[#eaeaea] text-[#999]"
                                    }`}
                            >
                                {step.id}
                            </motion.div>
                            <h3 className={`text-[24px] sm:text-[28px] md:text-[36px] font-medium mb-2 md:mb-3 tracking-[-0.02em] transition-colors duration-700 ${activeStep === i ? "text-[#111]" : "text-[#777]"}`}>{step.title}</h3>
                            <p className={`text-[14px] sm:text-[16px] md:text-[18px] font-medium leading-[1.4] tracking-tight max-w-sm transition-colors duration-700 ${activeStep === i ? "text-[#666]" : "text-[#999]"}`}>{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </motion.section>
    );
}
