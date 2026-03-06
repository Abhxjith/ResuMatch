"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { instrumentSerif } from "../../lib/fonts";
import { auth } from "../../lib/firebase";
import { BlurredStagger } from "../ui/blurred-stagger-text";

export default function Hero() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user: any) => {
            setUser(user);
        });
        return () => unsubscribe();
    }, []);
    return (
        <div className="flex flex-col items-center text-center z-10 relative mt-4 px-8 md:px-24 lg:px-32 max-w-4xl mx-auto">

            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="bg-[#e8e8e8] px-4 py-1.5 rounded-full flex items-center gap-1.5 text-[16px] font-medium leading-normal tracking-[-0.07em] mb-8 text-[#333]"
            >
                <span className="text-brand">AI</span>
                <span>Powered</span>
            </motion.div>

            <BlurredStagger
                text="Quit Tweaking"
                className={`text-[80px] md:text-[130px] leading-[0.85] tracking-[-0.07em] mb-8 ${instrumentSerif.className}`}
                staggerChildren={0.04}
                letterDuration={0.65}
            />

            <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
                className="text-[#555] text-[16px] font-medium leading-normal tracking-[-0.07em] mb-4 max-w-md"
            >
                shape your resume to your dream job
            </motion.p>

            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.65 }}
            >
                <Link
                    href={user ? "/workspace" : "/auth"}
                    className="bg-brand hover:bg-brand-hover text-black px-16 py-2.5 rounded-full text-[16px] font-medium leading-normal tracking-[-0.07em] transition-all duration-500 shadow-[0_0_40px_rgba(59,218,113,0.3)] hover:shadow-[0_0_60px_rgba(59,218,113,0.4)] hover:-translate-y-0.5 block w-fit mx-auto"
                >
                    try for free
                </Link>
            </motion.div>
        </div>
    );
}
