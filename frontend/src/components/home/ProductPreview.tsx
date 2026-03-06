"use client";

import Image from "next/image";
import { motion } from "motion/react";

export default function ProductPreview() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-5xl mt-20 sm:mt-28 md:mt-32 mb-8 md:mb-12 relative z-10 mx-auto px-1"
        >
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
                className="rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] border-4 sm:border-8 md:border-[12px] border-[#111] bg-[#111] transform perspective-1000 rotate-x-2"
            >
                <Image
                    src="/productpreview.png"
                    alt="ResuMatch Dashboard Preview"
                    width={1600}
                    height={1000}
                    className="w-full h-auto object-cover rounded-xl"
                    priority
                />
            </motion.div>
        </motion.div>
    );
}
