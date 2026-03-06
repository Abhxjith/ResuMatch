"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { BlurredStagger } from "../ui/blurred-stagger-text";
import { inter } from "../../lib/fonts";
import { auth } from "../../lib/firebase";

export default function CTA() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user: any) => {
            setUser(user);
        });
        return () => unsubscribe();
    }, []);

    return (
        <motion.section
            id="contact"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className={`w-full max-w-[1200px] mx-auto mt-12 sm:mt-16 md:mt-20 mb-12 sm:mb-16 md:mb-20 px-3 sm:px-4 md:px-0 ${inter.className}`}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                className="w-full min-h-[180px] sm:min-h-[200px] md:min-h-[220px] rounded-[2rem] sm:rounded-[3rem] md:rounded-[3.5rem] bg-gradient-to-r from-[#5ef58d] via-[#e5faee] to-[#5be48c] p-6 sm:p-10 md:p-12 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-sm"
            >

                {/* Decorative glow/shine effect */}
                <div className="absolute top-0 right-10 w-[60%] h-[150%] bg-gradient-to-l from-white/60 to-transparent blur-[80px] transform -rotate-12 pointer-events-none"></div>

                <div className="relative z-10 max-w-2xl mb-4 sm:mb-6 md:mb-8">
                    <BlurredStagger text="shape your resume to your dream job" as="h2" inView staggerChildren={0.025} letterDuration={0.5} className="text-[24px] sm:text-[28px] md:text-[36px] font-medium text-[#444] tracking-tight" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
                >
                    <Link
                        href={user ? "/workspace" : "/auth"}
                        className="px-8 py-3 rounded-full bg-[#3bda71] hover:bg-[#32c462] text-black text-[15px] font-medium transition-all duration-500 relative z-10 inline-block"
                    >
                        try for free
                    </Link>
                </motion.div>
            </motion.div>
        </motion.section>
    );
}
