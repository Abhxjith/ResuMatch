"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { instrumentSerif } from "../../lib/fonts";
import { auth } from "../../lib/firebase";

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
            <div className="bg-[#e8e8e8] px-4 py-1.5 rounded-full flex items-center gap-1.5 text-[16px] font-medium leading-normal tracking-[-0.07em] mb-8 text-[#333]">
                <span className="text-brand">AI</span>
                <span>Powered</span>
            </div>

            <h1
                className={`text-[80px] md:text-[130px] leading-[0.85] tracking-tight mb-8 ${instrumentSerif.className}`}
            >
                Quit Tweaking
            </h1>

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
