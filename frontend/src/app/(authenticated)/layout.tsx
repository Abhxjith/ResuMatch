"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { inter } from "../../../src/lib/fonts";
import { auth } from "../../../src/lib/firebase";
import type { User } from "firebase/auth";

export default function WorkspaceLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [collapsed, setCollapsed] = useState(false);
    const [authChecked, setAuthChecked] = useState(false);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user: User | null) => {
            setAuthChecked(true);
            if (!user) {
                router.replace("/auth");
            }
        });
        return () => unsubscribe();
    }, [router]);

    const navItems = [
        { name: "Workspace", path: "/workspace", icon: HomeIcon },
        { name: "History", path: "/history", icon: HistoryIcon },
    ];

    if (!authChecked) {
        return (
            <div className={`flex h-screen w-full bg-[#f4f4f4] items-center justify-center ${inter.className}`}>
                <div className="w-8 h-8 border-2 border-[#3bda71]/30 border-t-[#3bda71] rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className={`flex h-screen w-full bg-[#f4f4f4] overflow-hidden ${inter.className}`}>

            {/* ── Sidebar ─────────────────────────────────────────────────── */}
            <aside
                className="bg-[#111111] text-white flex flex-col h-full flex-shrink-0 relative transition-all duration-300 ease-in-out"
                style={{ width: collapsed ? '60px' : '240px' }}
                onMouseEnter={() => setCollapsed(false)}
                onMouseLeave={() => setCollapsed(true)}
            >

                <div className="flex flex-col justify-between h-full py-6 overflow-hidden">
                    <div>
                        {/* Logo */}
                        <Link
                            href="/"
                            className="flex items-center gap-3 mb-10 px-3 hover:opacity-80 transition-opacity"
                            style={{ justifyContent: collapsed ? 'center' : 'flex-start' }}
                        >
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center overflow-hidden flex-shrink-0">
                                <Image src="/target.png" alt="ResuMatch" width={32} height={32} className="w-full h-auto object-cover opacity-90" loading="eager" />
                            </div>
                            {!collapsed && <span className="font-semibold text-[17px] tracking-tight whitespace-nowrap">ResuMatch</span>}
                        </Link>

                        {/* Nav items */}
                        <nav className="flex flex-col gap-1">
                            {navItems.map((item) => {
                                const isActive = pathname === item.path;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.path}
                                        title={collapsed ? item.name : undefined}
                                        className={`flex items-center gap-3 rounded-xl text-[14px] font-medium transition-all duration-150 ${collapsed ? 'justify-center px-0 py-3 mx-2' : 'px-4 py-3 mx-2'
                                            } ${isActive
                                                ? "bg-[#222222] text-white"
                                                : "text-[#888888] hover:text-white hover:bg-[#1a1a1a]"
                                            }`}
                                    >
                                        <item.icon active={isActive} />
                                        {!collapsed && <span className="whitespace-nowrap">{item.name}</span>}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Settings */}
                    <Link
                        href="/settings"
                        title={collapsed ? "Settings" : undefined}
                        className={`flex items-center gap-3 rounded-xl text-[14px] font-medium transition-all duration-150 ${collapsed ? 'justify-center px-0 py-3 mx-2' : 'px-4 py-3 mx-2'
                            } ${pathname === "/settings"
                                ? "bg-[#222222] text-white"
                                : "text-[#888888] hover:text-white hover:bg-[#1a1a1a]"
                            }`}
                    >
                        <SettingsIcon active={pathname === "/settings"} />
                        {!collapsed && <span className="whitespace-nowrap">Settings</span>}
                    </Link>
                </div>
            </aside>

            {/* ── Main Content ─────────────────────────────────────────────── */}
            <main className="flex-1 h-full overflow-hidden w-full">
                {children}
            </main>
        </div>
    );
}

// ── Icons ──────────────────────────────────────────────────────────────────────
function HomeIcon({ active }: { active: boolean }) {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill={active ? "#3bda71" : "currentColor"} className="flex-shrink-0 transition-colors">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke={active ? "#3bda71" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="9 22 9 12 15 12 15 22" stroke={active ? "#3bda71" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function HistoryIcon({ active }: { active: boolean }) {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    );
}

function SettingsIcon({ active }: { active: boolean }) {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
    );
}
