"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { inter } from "../../lib/fonts";
import { auth } from "../../lib/firebase";

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user: any) => {
            setUser(user);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className={`fixed top-0 left-0 right-0 w-full z-50 flex justify-center px-4 pt-4 pb-2 transition-all duration-500 ease-in-out ${inter.className}`}>
            <header
                className={`w-full transition-all duration-500 ease-in-out ${isScrolled
                    ? "max-w-4xl bg-white/70 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.06)] ring-1 ring-black/5 py-3 px-8 translate-y-2 rounded-[2rem]"
                    : "max-w-5xl bg-transparent py-4 px-2 translate-y-0 rounded-2xl"
                    }`}
            >
                <nav className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className={`rounded-full flex items-center justify-center overflow-hidden transition-all duration-500 ease-in-out ${isScrolled ? "w-9 h-9" : "w-12 h-12"}`}>
                            <Image src="/target.png" alt="ResuMatch Logo" width={48} height={48} className="w-full h-auto object-cover" />
                        </div>
                    </div>

                    <div className={`hidden md:flex items-center font-medium text-[16px] leading-normal tracking-[-0.07em] text-[#333] transition-all duration-500 ${isScrolled ? "gap-6" : "gap-10"}`}>
                        <button onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="hover:text-black transition-colors">home</button>
                        <button onClick={(e) => { e.preventDefault(); document.getElementById('how-it-works')?.scrollIntoView({ behavior: "smooth" }); }} className="hover:text-black transition-colors">how it works?</button>
                        <button onClick={(e) => { e.preventDefault(); document.getElementById('pricing')?.scrollIntoView({ behavior: "smooth" }); }} className="hover:text-black transition-colors">pricing</button>
                        <button onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: "smooth" }); }} className="hover:text-black transition-colors">contact</button>
                    </div>
                    <div className="flex items-center gap-6">
                        {!user && (
                            <Link href="/auth" className="hidden md:block font-medium text-[15px] text-[#666] hover:text-[#111] transition-colors">
                                login
                            </Link>
                        )}
                        <Link
                            href={user ? "/workspace" : "/auth"}
                            className={`bg-brand hover:bg-brand-hover text-black rounded-full font-medium text-[16px] leading-normal tracking-[-0.07em] transition-all duration-300 ${isScrolled ? "px-6 py-2 shadow-sm" : "px-7 py-2.5"}`}
                        >
                            {user ? "go to workspace" : "try for free"}
                        </Link>
                    </div>
                </nav>
            </header>
        </div>
    );
}
