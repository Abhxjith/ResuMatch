"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { inter } from "../../../../src/lib/fonts";
import { auth } from "../../../../src/lib/firebase";
import type { User } from "firebase/auth";

export default function SettingsPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((u: User | null) => {
            setUser(u);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleSignOut = () => {
        auth.signOut();
        router.replace("/");
    };

    return (
        <div className={`p-10 lg:p-14 ${inter.className}`}>
            <h1 className="text-[28px] font-medium text-[#111] mb-8 tracking-tight">
                Settings
            </h1>

            <div className="bg-white p-6 rounded-2xl border border-[#eaeaea] max-w-xl">
                <h2 className="text-[17px] font-medium text-[#111] mb-4">Account</h2>
                {loading ? (
                    <p className="text-[14px] text-[#888] mb-8">Loading…</p>
                ) : (
                    <div className="flex items-center justify-between mb-8">
                        <span className="text-[14px] text-[#666]">Email</span>
                        <span className="text-[15px] font-medium text-[#111]">
                            {user?.email ?? "Not signed in"}
                        </span>
                    </div>
                )}

                <button
                    onClick={handleSignOut}
                    disabled={loading}
                    className="px-6 py-2.5 rounded-full border border-[#eaeaea] text-[#cf3a3a] hover:bg-[#fff9f9] hover:border-[#cf3a3a] text-[14px] font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Sign Out
                </button>
            </div>
        </div>
    );
}
