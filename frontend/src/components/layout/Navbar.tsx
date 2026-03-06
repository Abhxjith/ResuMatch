"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { inter } from "../../lib/fonts";
import { auth } from "../../lib/firebase";

const navLinks = [
    { label: "home", scroll: () => window.scrollTo({ top: 0, behavior: "smooth" }) },
    { label: "how it works?", scroll: () => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" }) },
    { label: "pricing", scroll: () => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" }) },
    { label: "contact", scroll: () => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }) },
];

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((u: any) => setUser(u));
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (mobileMenuOpen) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "";
        return () => { document.body.style.overflow = ""; };
    }, [mobileMenuOpen]);

    return (
        <div className={`fixed top-0 left-0 right-0 w-full z-50 flex justify-center px-3 sm:px-4 pt-3 sm:pt-4 pb-2 transition-all duration-500 ease-in-out ${inter.className}`}>
            <header
                className={`w-full transition-all duration-500 ease-in-out ${isScrolled
                    ? "max-w-4xl bg-white/70 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.06)] ring-1 ring-black/5 py-2.5 sm:py-3 px-4 sm:px-8 translate-y-2 rounded-[1.5rem] sm:rounded-[2rem]"
                    : "max-w-5xl bg-transparent py-3 sm:py-4 px-2 translate-y-0 rounded-2xl"
                    }`}
            >
                <nav className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className={`rounded-full flex items-center justify-center overflow-hidden transition-all duration-500 ease-in-out ${isScrolled ? "w-8 h-8 sm:w-9 sm:h-9" : "w-10 h-10 sm:w-12 sm:h-12"}`}>
                            <Image src="/target.png" alt="ResuMatch Logo" width={48} height={48} className="w-full h-auto object-cover" priority loading="eager" />
                        </div>
                    </div>

                    <div className={`hidden md:flex items-center font-medium text-[16px] leading-normal tracking-[-0.07em] text-[#333] transition-all duration-500 ${isScrolled ? "gap-6" : "gap-10"}`}>
                        {navLinks.map((link) => (
                            <button key={link.label} onClick={(e) => { e.preventDefault(); link.scroll(); }} className="hover:text-black transition-colors">{link.label}</button>
                        ))}
                    </div>

                    <div className="flex items-center gap-3 sm:gap-6">
                        <Link href="/auth" className="hidden md:block font-medium text-[15px] text-[#666] hover:text-[#111] transition-colors">login</Link>
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 -mr-2 rounded-lg hover:bg-black/5 transition-colors"
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? (
                                <svg className="w-5 h-5 text-[#333]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            ) : (
                                <svg className="w-5 h-5 text-[#333]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
                            )}
                        </button>
                        <Link
                            href={user ? "/workspace" : "/auth"}
                            className={`bg-brand hover:bg-brand-hover text-black rounded-full font-medium text-[14px] sm:text-[16px] leading-normal tracking-[-0.07em] transition-all duration-300 ${isScrolled ? "px-4 sm:px-6 py-1.5 sm:py-2 shadow-sm" : "px-5 sm:px-7 py-2 sm:py-2.5"}`}
                        >
                            try for free
                        </Link>
                    </div>
                </nav>
            </header>

            {/* Mobile menu overlay */}
            {mobileMenuOpen && (
                <div
                    className="md:hidden fixed inset-0 top-[60px] bg-white/95 backdrop-blur-lg z-40 flex flex-col items-center justify-center gap-8 py-12"
                    onClick={() => setMobileMenuOpen(false)}
                >
                    {navLinks.map((link) => (
                        <button
                            key={link.label}
                            onClick={(e) => { e.stopPropagation(); link.scroll(); setMobileMenuOpen(false); }}
                            className="text-[22px] font-medium text-[#333] hover:text-black transition-colors"
                        >
                            {link.label}
                        </button>
                    ))}
                    <Link href="/auth" className="text-[18px] font-medium text-[#666] hover:text-[#111] transition-colors" onClick={() => setMobileMenuOpen(false)}>
                        login
                    </Link>
                </div>
            )}
        </div>
    );
}
