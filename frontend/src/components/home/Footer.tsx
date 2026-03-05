"use client";

import Link from "next/link";
import { inter } from "../../lib/fonts";

export default function Footer() {
    return (
        <footer className={`w-full max-w-[1400px] mx-auto px-4 pb-4 ${inter.className}`}>
            <div className="w-full rounded-[3rem] bg-black text-white px-8 md:px-16 pt-16 pb-12 flex flex-col justify-between overflow-hidden relative">

                {/* Top Links Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full mb-32 md:mb-40 gap-8 z-10">
                    <div className="text-[28px] md:text-[32px] font-medium tracking-tight">
                        match ur resume.
                    </div>

                    <div className="flex flex-wrap gap-6 md:gap-10 text-[16px] text-[#e0e0e0] font-medium tracking-tight">
                        <Link href="/" className="hover:text-white transition-colors">home</Link>
                        <Link href="/#how-it-works" className="hover:text-white transition-colors">how it works?</Link>
                        <Link href="/#pricing" className="hover:text-white transition-colors">pricing</Link>
                        <Link href="/#contact" className="hover:text-white transition-colors">contact</Link>
                    </div>
                </div>

                {/* Bottom Massive Text Section */}
                <div className="w-full flex flex-col items-center justify-center mt-10 md:mt-16 z-10 text-center gap-2 md:gap-4">
                    <h1 className="w-full text-[14vw] sm:text-[16vw] md:text-[14vw] xl:text-[210px] leading-[0.8] font-bold tracking-tighter select-none pr-2">
                        <span className="text-[#3bda71]">Resu</span><span className="text-white">Match</span>
                    </h1>

                    <p className="text-[#888] text-[13px] font-medium mt-4">
                        © 2026 Incredible. All rights reserved.
                    </p>
                </div>

            </div>
        </footer>
    );
}
