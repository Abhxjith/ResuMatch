"use client";

import { inter } from "../../../../src/lib/fonts";

export default function HistoryPage() {
    return (
        <div className={`p-10 lg:p-14 ${inter.className}`}>
            <h1 className="text-[28px] font-medium text-[#111] mb-8 tracking-tight">
                History
            </h1>
            <p className="text-[#666] text-[15px]">
                Your past tailored resumes will appear here.
            </p>
        </div>
    );
}
