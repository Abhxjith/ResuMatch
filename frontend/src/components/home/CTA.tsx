"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
        <section id="contact" className={`w-full max-w-[1200px] mx-auto mt-20 mb-20 px-4 md:px-0 ${inter.className}`}>
            <div className="w-full min-h-[220px] rounded-[3.5rem] bg-gradient-to-r from-[#5ef58d] via-[#e5faee] to-[#5be48c] p-12 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-sm">

                {/* Decorative glow/shine effect */}
                <div className="absolute top-0 right-10 w-[60%] h-[150%] bg-gradient-to-l from-white/60 to-transparent blur-[80px] transform -rotate-12 pointer-events-none"></div>

                <h2 className="text-[32px] md:text-[36px] font-medium text-[#444] mb-8 tracking-tight relative z-10 max-w-2xl">
                    shape your resume to your dream job
                </h2>

                <Link
                    href={user ? "/workspace" : "/auth"}
                    className="px-8 py-3 rounded-full bg-[#3bda71] hover:bg-[#32c462] text-black text-[15px] font-medium transition-colors relative z-10"
                >
                    {user ? "go to workspace" : "try for free"}
                </Link>
            </div>
        </section>
    );
}
