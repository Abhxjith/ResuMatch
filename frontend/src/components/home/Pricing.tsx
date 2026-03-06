"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { BlurredStagger } from "../ui/blurred-stagger-text";
import { inter } from "../../lib/fonts";

export default function Pricing() {
    const features = [
        "1 resume preview only",
        "No download",
        "No copy",
        "No history"
    ];

    return (
        <motion.section
            id="pricing"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className={`w-full max-w-[1100px] mx-auto mt-16 sm:mt-24 md:mt-32 mb-16 sm:mb-24 md:mb-32 relative ${inter.className}`}
        >

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="w-full flex flex-col items-center mb-12 px-4"
            >
                <h2 className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-[28px] sm:text-[36px] md:text-[46px] leading-tight font-medium tracking-tight text-[#111] mb-2 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                        className="w-[50px] h-[50px] md:w-[60px] md:h-[60px] -mt-2"
                    >
                        <Image src="/bee.png" alt="bee icon" width={80} height={80} className="w-full h-full object-contain mix-blend-multiply" />
                    </motion.div>
                    <BlurredStagger text="Plans to Boost your Job Search." as="span" inView staggerChildren={0.028} letterDuration={0.5} className="inline" />
                </h2>
                <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
                    className="text-[#666] text-[16px] md:text-[18px] font-medium tracking-[-0.02em]"
                >
                    shape your resume to your dream job
                </motion.p>
            </motion.div>

            {/* Pricing Cards Container */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 w-full px-3 sm:px-4 md:px-0">

                {/* Base Plan */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
                    className="bg-white rounded-[2rem] p-7 flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-[#eaeaea]"
                >
                    <h3 className="text-[18px] font-semibold tracking-tight text-[#111] mb-0.5">base plan.</h3>
                    <p className="text-[#999] text-[11px] font-medium mb-6">this is the base plan</p>
                    <div className="text-[28px] font-medium tracking-tight text-[#111] mb-6">Free</div>
                    <button className="w-full py-3 rounded-full bg-[#e6faee] text-[#111] text-[14px] font-medium mb-6 hover:bg-[#d1f2e0] transition-colors tracking-tight">
                        select plan
                    </button>
                    <div className="bg-[#f4f4f4] rounded-2xl p-5 flex-1">
                        <ul className="space-y-3.5">
                            {features.map((feature, i) => (
                                <li key={i} className="flex items-start gap-2.5 text-[12px] font-semibold tracking-tight text-[#111]">
                                    <div className="mt-0.5 text-[#111]">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="4"></rect><path d="m9 12 2 2 4-4"></path></svg>
                                    </div>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>
                </motion.div>

                {/* Favorite Plan */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
                    className="bg-white rounded-[2rem] p-7 flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-[#eaeaea]"
                >
                    <h3 className="text-[18px] font-semibold tracking-tight text-[#111] mb-0.5">favorite plan.</h3>
                    <p className="text-[#999] text-[11px] font-medium mb-6">this is the base plan</p>
                    <div className="text-[28px] font-medium tracking-tight text-[#111] mb-6">Free</div>
                    <button className="w-full py-3 rounded-full bg-[#5be48c] hover:bg-[#4ddc7f] text-black text-[14px] font-medium mb-6 transition-colors tracking-tight">
                        select plan
                    </button>
                    <div className="bg-[#f4f4f4] rounded-2xl p-5 flex-1">
                        <ul className="space-y-3.5">
                            {features.map((feature, i) => (
                                <li key={i} className="flex items-start gap-2.5 text-[12px] font-semibold tracking-tight text-[#111]">
                                    <div className="mt-0.5 text-[#111]">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="4"></rect><path d="m9 12 2 2 4-4"></path></svg>
                                    </div>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>
                </motion.div>

                {/* Super Plan */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.45 }}
                    className="bg-white rounded-[2rem] p-7 flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-[#eaeaea]"
                >
                    <h3 className="text-[18px] font-semibold tracking-tight text-[#111] mb-0.5">super plan.</h3>
                    <p className="text-[#999] text-[11px] font-medium mb-6">this is the base plan</p>
                    <div className="text-[28px] font-medium tracking-tight text-[#111] mb-6">Free</div>
                    <button className="w-full py-3 rounded-full bg-[#e6faee] text-[#111] text-[14px] font-medium mb-6 hover:bg-[#d1f2e0] transition-colors tracking-tight">
                        select plan
                    </button>
                    <div className="bg-[#f4f4f4] rounded-2xl p-5 flex-1">
                        <ul className="space-y-3.5">
                            {features.map((feature, i) => (
                                <li key={i} className="flex items-start gap-2.5 text-[12px] font-semibold tracking-tight text-[#111]">
                                    <div className="mt-0.5 text-[#111]">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="4"></rect><path d="m9 12 2 2 4-4"></path></svg>
                                    </div>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>
                </motion.div>

            </div>
        </motion.section>
    );
}
