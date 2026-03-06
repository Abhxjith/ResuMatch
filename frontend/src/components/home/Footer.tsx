"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { BlurredStagger } from "../ui/blurred-stagger-text";
import { inter } from "../../lib/fonts";

export default function Footer() {
    return (
        <motion.footer
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className={`w-full max-w-[1400px] mx-auto px-3 sm:px-4 pb-4 ${inter.className}`}
        >
                <div className="w-full rounded-[2rem] sm:rounded-[3rem] bg-black text-white px-6 sm:px-8 md:px-16 pt-12 sm:pt-16 pb-10 sm:pb-12 flex flex-col justify-between overflow-hidden relative">

                {/* Top Links Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full mb-20 sm:mb-28 md:mb-40 gap-6 sm:gap-8 z-10">
                    <div className="text-[22px] sm:text-[26px] md:text-[32px] font-medium tracking-tight">
                        <BlurredStagger text="match ur resume." as="span" inView staggerChildren={0.04} letterDuration={0.5} className="inline" />
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                        className="flex flex-wrap gap-6 md:gap-10 text-[16px] text-[#e0e0e0] font-medium tracking-tight"
                    >
                        <Link href="/" className="hover:text-white transition-colors">home</Link>
                        <Link href="/#how-it-works" className="hover:text-white transition-colors">how it works?</Link>
                        <Link href="/#pricing" className="hover:text-white transition-colors">pricing</Link>
                        <Link href="/#contact" className="hover:text-white transition-colors duration-300">contact</Link>
                    </motion.div>
                </div>

                {/* Bottom Massive Text Section */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                    className="w-full flex flex-col items-center justify-center mt-10 md:mt-16 z-10 text-center gap-2 md:gap-4"
                >
                    <h1 className="w-full text-[14vw] sm:text-[16vw] md:text-[14vw] xl:text-[210px] leading-[0.8] font-bold tracking-tighter select-none pr-2">
                        <BlurredStagger text="Resu" as="span" inView staggerChildren={0.02} letterDuration={0.4} className="inline text-[#3bda71]" />
                        <BlurredStagger text="Match" as="span" inView staggerChildren={0.02} letterDuration={0.4} className="inline text-white" />
                    </h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
                        className="text-[#888] text-[13px] font-medium mt-4"
                    >
                        © 2026 Incredible. All rights reserved.
                    </motion.p>
                </motion.div>

            </div>
        </motion.footer>
    );
}
