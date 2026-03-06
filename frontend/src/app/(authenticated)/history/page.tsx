"use client";

import { useEffect, useState } from "react";
import { fetchHistory, getDownloadUrl } from "../../../lib/api";
import { inter } from "../../../lib/fonts";

interface HistoryItem {
    id: string;
    optimizedJson?: string;
    firebaseStorageUrl?: string;
    pdfPath?: string;
    createdAt: string;
}

export default function HistoryPage() {
    const [items, setItems] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function load() {
            try {
                const data = await fetchHistory();
                setItems(data || []);
            } catch (e) {
                setError((e as Error).message);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const formatDate = (iso: string) => {
        const d = new Date(iso);
        return d.toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const getName = (item: HistoryItem) => {
        try {
            const j = JSON.parse(item.optimizedJson || "{}");
            return j.name || "Untitled Resume";
        } catch {
            return "Untitled Resume";
        }
    };

    if (loading) {
        return (
            <div className={`p-10 lg:p-14 ${inter.className}`}>
                <h1 className="text-[28px] font-medium text-[#111] mb-8 tracking-tight">History</h1>
                <p className="text-[#666] text-[15px]">Loading…</p>
            </div>
        );
    }

    return (
        <div className={`p-10 lg:p-14 ${inter.className}`}>
            <h1 className="text-[28px] font-medium text-[#111] mb-8 tracking-tight">History</h1>

            {error && (
                <p className="text-red-600 text-[15px] mb-4">{error}</p>
            )}

            {items.length === 0 ? (
                <p className="text-[#666] text-[15px]">Your past tailored resumes will appear here.</p>
            ) : (
                <ul className="space-y-4">
                    {items.map((item) => (
                        <li
                            key={item.id}
                            className="flex items-center justify-between gap-4 py-4 px-5 rounded-xl bg-white border border-[#eaeaea] shadow-sm"
                        >
                            <div>
                                <p className="font-medium text-[#111]">{getName(item)}</p>
                                <p className="text-[13px] text-[#888] mt-0.5">{formatDate(item.createdAt)}</p>
                            </div>
                            <a
                                href={getDownloadUrl(item.id)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-5 py-2.5 rounded-full bg-[#3bda71] hover:bg-[#32c462] text-black text-[14px] font-medium transition-colors"
                            >
                                Download PDF
                            </a>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
