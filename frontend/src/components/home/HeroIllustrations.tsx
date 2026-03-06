"use client";

import Image from "next/image";
import { motion } from "motion/react";

export default function HeroIllustrations() {
    return (
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible max-w-7xl mx-auto">

            {/* Bee Illustration */}
            <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, type: "spring", bounce: 0.25, delay: 0.2 }}
                className="absolute top-[3.5rem] md:top-[5rem] left-[5%] md:left-[12%] w-16 md:w-20 -rotate-12 opacity-90 mix-blend-multiply"
            >
                <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 7, repeat: Infinity, ease: [0.4, 0, 0.6, 1] }}
                    className="w-full"
                >
                    <Image src="/bee.png" alt="Bee illustration" width={150} height={150} className="w-full h-auto" />
                </motion.div>
            </motion.div>

            {/* clap.png */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, type: "spring", bounce: 0.25, delay: 0.3 }}
                className="absolute top-[12rem] sm:top-[14rem] md:top-[16rem] left-[-4%] sm:left-[-2%] md:left-[2%] w-40 sm:w-56 md:w-[380px] mix-blend-multiply opacity-80 sm:opacity-100"
            >
                <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: [0.4, 0, 0.6, 1] }}
                    className="w-full"
                >
                    <Image src="/clap.png" alt="High five illustration" width={600} height={600} className="w-full h-auto object-contain" priority />
                </motion.div>
            </motion.div>

            {/* run.png */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, type: "spring", bounce: 0.25, delay: 0.4 }}
                className="absolute top-[9rem] sm:top-[10rem] md:top-[12rem] right-[-8%] sm:right-[-5%] md:right-[2%] w-[180px] sm:w-[250px] md:w-[350px] mix-blend-multiply opacity-80 sm:opacity-100"
            >
                <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 7.5, repeat: Infinity, ease: [0.4, 0, 0.6, 1] }}
                    className="w-full"
                >
                    <Image src="/run.png" alt="Delivery illustration" width={500} height={500} className="w-full h-auto object-contain" />
                </motion.div>
            </motion.div>

        </div>
    );
}
