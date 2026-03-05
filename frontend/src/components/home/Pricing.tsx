"use client";

import Image from "next/image";
import { inter } from "../../lib/fonts";

export default function Pricing() {
    const features = [
        "1 resume preview only",
        "No download",
        "No copy",
        "No history"
    ];

    return (
        <section id="pricing" className={`w-full max-w-[1100px] mx-auto mt-32 mb-32 relative ${inter.className}`}>

            {/* Header */}
            <div className="w-full flex flex-col items-center mb-12 px-4">
                <h2 className="flex items-center gap-4 text-[40px] md:text-[46px] leading-tight font-medium tracking-tight text-[#111] mb-2">
                    <div className="w-[50px] h-[50px] md:w-[60px] md:h-[60px] -mt-2">
                        <Image src="/bee.png" alt="bee icon" width={80} height={80} className="w-full h-full object-contain mix-blend-multiply" />
                    </div>
                    Plans to Boost your Job Search.
                </h2>
                <p className="text-[#666] text-[16px] md:text-[18px] font-medium tracking-[-0.02em]">
                    shape your resume to your dream job
                </p>
            </div>

            {/* Pricing Cards Container */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full px-4 md:px-0">

                {/* Base Plan */}
                <div className="bg-white rounded-[2rem] p-7 flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-[#eaeaea]">
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
                </div>

                {/* Favorite Plan */}
                <div className="bg-white rounded-[2rem] p-7 flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-[#eaeaea]">
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
                </div>

                {/* Super Plan */}
                <div className="bg-white rounded-[2rem] p-7 flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-[#eaeaea]">
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
                </div>

            </div>
        </section>
    );
}
