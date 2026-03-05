"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { instrumentSerif } from "../../lib/fonts";
import { auth } from "../../lib/firebase";
import { motion } from "motion/react";
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
        <div className="flex flex-col items-center text-center z-10 relative mt-4">

            {/* Animated floating stickers */}
            <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, type: "spring", bounce: 0.5, delay: 0.2 }}
                className="absolute top-10 -left-16 md:top-20 md:-left-32 -z-10 bg-white p-3 rounded-2xl shadow-xl rotate-[-12deg]"
            >
                <div className="bg-blue-100 text-blue-600 p-2 rounded-xl">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, type: "spring", bounce: 0.5, delay: 0.4 }}
                className="absolute top-32 -right-8 md:top-24 md:-right-24 -z-10 bg-white p-3 rounded-2xl shadow-xl rotate-[15deg]"
            >
                <div className="bg-purple-100 text-purple-600 p-2 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">✨</span>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, type: "spring", bounce: 0.5, delay: 0.6 }}
                className="absolute -bottom-8 -left-8 md:bottom-2 md:-left-20 -z-10 bg-white p-3 rounded-2xl shadow-xl rotate-[8deg]"
            >
                <div className="bg-green-100 text-green-600 p-2 rounded-xl">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
            </motion.div>

            <div className="bg-[#e8e8e8] px-4 py-1.5 rounded-full flex items-center gap-1.5 text-[16px] font-medium leading-normal tracking-[-0.07em] mb-8 text-[#333]">
                <span className="text-brand">AI</span>
                <span>Powered</span>
            </div>

            <BlurredStagger
                text="Quit Tweaking"
                className={`text-[80px] md:text-[130px] leading-[0.85] tracking-tight mb-8 ${instrumentSerif.className}`}
            />

            <p className="text-[#555] text-[16px] font-medium leading-normal tracking-[-0.07em] mb-12 max-w-md">
                shape your resume to your dream job
            </p>

            <Link
                href={user ? "/workspace" : "/auth"}
                className="bg-brand hover:bg-brand-hover text-black px-10 py-4 auto rounded-full text-[16px] font-medium leading-normal tracking-[-0.07em] transition-all duration-300 shadow-[0_0_40px_rgba(59,218,113,0.3)] hover:shadow-[0_0_60px_rgba(59,218,113,0.4)] hover:-translate-y-1 block w-fit mt-12 mb-0 mx-auto"
            >
                {user ? "go to workspace" : "try for free"}
            </Link>
        </div>
    );
}
