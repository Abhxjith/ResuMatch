"use client";

import { useState, useRef, useCallback } from "react";
import { inter } from "../../../../src/lib/fonts";
import { generateResume, updateResume, getDownloadUrl, OptimizedResume } from "../../../../src/lib/api";
import KineticDotsLoader from "@/components/ui/kinetic-dots-loader";

// ──────────────────────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────────────────────
type Stage = "idle" | "processing" | "done" | "error";

// ──────────────────────────────────────────────────────────────────────────────
// Workspace Page
// ──────────────────────────────────────────────────────────────────────────────
export default function WorkspacePage() {
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [jobDescription, setJobDescription] = useState("");

    const [stage, setStage] = useState<Stage>("idle");
    const [error, setError] = useState<string | null>(null);

    const [sessionId, setSessionId] = useState<string | null>(null);
    const [optimized, setOptimized] = useState<OptimizedResume | null>(null);
    const [editedLatex, setEditedLatex] = useState<string>("");
    const [isSaving, setIsSaving] = useState(false);
    const [pdfPath, setPdfPath] = useState<string | null>(null);

    // Draggable split
    const [leftPct, setLeftPct] = useState(40); // percentage
    const containerRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);

    const onDragStart = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        isDragging.current = true;
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';

        const onMove = (ev: MouseEvent) => {
            if (!isDragging.current || !containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const newPct = ((ev.clientX - rect.left) / rect.width) * 100;
            setLeftPct(Math.min(Math.max(newPct, 20), 80));
        };
        const onUp = () => {
            isDragging.current = false;
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
        };
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
    }, []);

    const userFirstName = "Abhijith";

    // ── File picker ──────────────────────────────────────────────────────────
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setResumeFile(e.target.files[0]);
        }
    };

    // ── Main CTA: upload + optimize ─────────────────────────────────────────
    const handleTailorResume = async () => {
        if (!resumeFile || !jobDescription) return;
        setStage("processing");
        setError(null);
        try {
            const result = await generateResume(resumeFile, "", jobDescription);
            setOptimized(result.optimizedJson);
            setEditedLatex(result.latexSource || "");
            setPdfPath(result.pdfPath);
            setSessionId((result as any).sessionId || result.pdfPath || "");
            setStage("done");
        } catch (err: any) {
            setError(err.message || "Something went wrong.");
            setStage("error");
        }
    };

    // ── Save edits ───────────────────────────────────────────────────────────
    const handleSaveEdits = async () => {
        if (!sessionId || !optimized) return;
        setIsSaving(true);
        try {
            // Send the full updated JSON back to backend to generate the new PDF
            const result = await updateResume(sessionId, optimized, editedLatex);
            if (result.updatedResumeJson) setOptimized(result.updatedResumeJson);
            if (result.latexSource) setEditedLatex(result.latexSource);
            setPdfPath(result.pdfPath);
        } catch (err: any) {
            alert("Save failed: " + err.message);
        } finally {
            setIsSaving(false);
        }
    };

    // ── State Updaters for UI ────────────────────────────────────────────────
    const updateField = (field: keyof OptimizedResume, value: any) => {
        if (!optimized) return;
        setOptimized({ ...optimized, [field]: value });
    };

    const updateExperience = (index: number, field: string, value: string) => {
        if (!optimized) return;
        const newExp = [...(optimized.experience || [])];
        newExp[index] = { ...newExp[index], [field]: value };
        setOptimized({ ...optimized, experience: newExp });
    };

    const updateExperienceBullet = (expIndex: number, bulletIndex: number, value: string) => {
        if (!optimized) return;
        const newExp = [...(optimized.experience || [])];
        const newBullets = [...(newExp[expIndex].bullets || [])];
        newBullets[bulletIndex] = value;
        newExp[expIndex] = { ...newExp[expIndex], bullets: newBullets };
        setOptimized({ ...optimized, experience: newExp });
    };

    // skills can be { "Languages": [...], ... } (new) or string[] (legacy)
    const getSkillsObj = (): Record<string, string[]> => {
        if (!optimized?.skills) return {};
        if (Array.isArray(optimized.skills)) return { 'Technical Skills': optimized.skills as string[] };
        return optimized.skills as Record<string, string[]>;
    };

    const updateSkillInCategory = (category: string, idx: number, value: string) => {
        if (!optimized) return;
        const obj = getSkillsObj();
        const newCat = [...(obj[category] || [])];
        newCat[idx] = value;
        setOptimized({ ...optimized, skills: { ...obj, [category]: newCat } as any });
    };

    const updateEducation = (index: number, field: string, value: string) => {
        if (!optimized) return;
        const newEdu = [...(optimized.education || [])];
        newEdu[index] = { ...newEdu[index], [field]: value };
        setOptimized({ ...optimized, education: newEdu });
    };

    const updateExtracurricular = (index: number, value: string) => {
        if (!optimized) return;
        const newEx = [...(optimized.extracurriculars || [])];
        newEx[index] = value;
        setOptimized({ ...optimized, extracurriculars: newEx });
    };

    const updateLeadership = (index: number, value: string) => {
        if (!optimized) return;
        const newLead = [...(optimized.leadership || [])];
        newLead[index] = value;
        setOptimized({ ...optimized, leadership: newLead });
    };

    // ── Download ─────────────────────────────────────────────────────────────
    const [isDownloading, setIsDownloading] = useState(false);
    const handleDownload = async () => {
        if (!sessionId) return;
        setIsDownloading(true);
        try {
            const res = await fetch(getDownloadUrl(sessionId));
            if (!res.ok) {
                const json = await res.json().catch(() => ({}));
                throw new Error(json.message || 'Download failed');
            }
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'resume.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (err: any) {
            alert('Download failed: ' + err.message);
        } finally {
            setIsDownloading(false);
        }
    };

    // ──────────────────────────────────────────────────────────────────────────
    // Render
    // ──────────────────────────────────────────────────────────────────────────
    return (
        <div ref={containerRef} className={`flex w-full h-full ${inter.className}`}>

            {/* ─── Left Column: Input Form ─────────────────────────────────── */}
            <div className="h-full flex flex-col overflow-y-auto px-10 py-10" style={{ width: `${leftPct}%`, flexShrink: 0 }}>
                <h1 className="text-[28px] font-medium text-[#111] mb-8 tracking-tight">
                    Hey, {userFirstName}!
                </h1>

                {/* Status bar with Rectangle.png background */}
                <div
                    className="w-full h-24 rounded-2xl mb-10 shadow-sm relative overflow-hidden flex items-center px-6 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: "url('/Rectangle.png')" }}
                >
                    <div className="absolute inset-0 bg-black/20 rounded-2xl" aria-hidden />
                    <p className="relative z-10 text-white font-medium text-[15px] md:text-[17px] tracking-tight drop-shadow-sm">
                        Shape your resume to your dream job
                    </p>
                </div>

                <div className="flex flex-col gap-6 w-full max-w-[500px]">

                    {/* Upload Card */}
                    <div className="w-full relative border-2 border-dashed border-[#e5e5e5] rounded-3xl p-8 hover:border-[#3bda71] hover:bg-[#3bda71]/5 transition-all group bg-white">
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={handleFileUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="flex flex-col items-center justify-center text-center">
                            <svg className="w-10 h-10 text-[#666] group-hover:text-[#3bda71] transition-colors mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                            </svg>
                            <span className="text-[17px] font-medium text-[#111] mb-1">
                                {resumeFile ? resumeFile.name : "Upload your resume"}
                            </span>
                            <span className="text-[13px] text-[#888]">PDF only • We don&apos;t store your files.</span>
                        </div>
                    </div>



                    {/* Job Description */}
                    <div className="relative">
                        <div className="absolute left-4 top-4 text-[#888]">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                            </svg>
                        </div>
                        <textarea
                            placeholder="Paste the job description here..."
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            className="w-full min-h-[160px] bg-[#f1f1f1] border border-transparent focus:bg-white focus:border-[#3bda71] focus:ring-1 focus:ring-[#3bda71] rounded-xl py-4 pl-12 pr-4 text-[15px] text-[#111] placeholder:text-[#888] outline-none transition-all resize-y"
                        />
                    </div>

                    {/* Error */}
                    {stage === "error" && error && (
                        <div className="w-full bg-red-50 border border-red-200 rounded-xl px-5 py-4 text-red-600 text-[14px]">
                            {error}
                        </div>
                    )}

                    {/* Primary Button */}
                    <button
                        onClick={handleTailorResume}
                        disabled={!resumeFile || !jobDescription || stage === "processing"}
                        className="w-full bg-[#3bda71] hover:bg-[#32c462] text-white py-4 rounded-xl text-[16px] font-medium transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                    >
                        {stage === "processing" ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                                </svg>
                                Tailor my Resume
                            </>
                        )}
                    </button>

                    {/* Saving edits button — appears when done */}
                    {stage === "done" && (
                        <button
                            onClick={handleSaveEdits}
                            disabled={isSaving}
                            className="w-full bg-white border border-[#e0e0e0] hover:border-[#3bda71] text-[#111] py-4 rounded-xl text-[16px] font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-40"
                        >
                            {isSaving ? (
                                <div className="w-4 h-4 border-2 border-[#999]/30 border-t-[#999] rounded-full animate-spin" />
                            ) : (
                                <>
                                    <svg className="w-5 h-5 text-[#3bda71]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                                    </svg>
                                    Save edits & Regenerate PDF
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>

            {/* ─── Drag Divider ─────────────────────────────────────────── */}
            <div
                onMouseDown={onDragStart}
                className="w-[5px] h-full flex-shrink-0 flex items-center justify-center cursor-col-resize group relative z-10"
                style={{ background: 'transparent' }}
            >
                {/* Visual handle strip */}
                <div className="w-[3px] h-16 rounded-full bg-[#d0d0d0] group-hover:bg-[#3bda71] group-active:bg-[#3bda71] transition-colors opacity-70 group-hover:opacity-100" />
            </div>

            {/* ─── Right Column: Resume Paper ───────────────────────────── */}
            <div className="flex-1 h-full min-w-0 bg-[#e8e8e8] flex flex-col items-center overflow-y-auto py-6 px-4">

                {stage === "done" && optimized ? (
                    <>
                        {/* Toolbar above paper */}
                        <div className="w-full max-w-[760px] flex items-center justify-between mb-3">
                            <span className="text-[11px] text-[#999] font-medium">Click any field to edit</span>
                            <button
                                onClick={handleDownload}
                                disabled={isDownloading || !sessionId}
                                className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-white text-[#27a856] text-[12px] font-medium hover:bg-[#f0fdf4] border border-[#d1fae5] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isDownloading ? (
                                    <div className="w-3.5 h-3.5 border-2 border-[#27a856]/30 border-t-[#27a856] rounded-full animate-spin" />
                                ) : (
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                    </svg>
                                )}
                                {isDownloading ? 'Downloading…' : 'Download PDF'}
                            </button>
                        </div>

                        {/* ── White Paper ── */}
                        <div className="w-full max-w-[760px] bg-white shadow-[0_4px_32px_rgba(0,0,0,0.18)] rounded-sm px-10 py-6 font-serif text-[#111]">

                            {/* ── NAME (centered, allcaps, bold) ── */}
                            <div className="text-center mb-1">
                                <input
                                    value={optimized.name || ""}
                                    onChange={(e) => updateField('name', e.target.value)}
                                    className="text-center w-full text-[20px] font-black uppercase tracking-wide bg-transparent border-b border-transparent hover:border-[#ccc] focus:border-[#3bda71] outline-none transition-all"
                                    placeholder="FIRSTNAME LASTNAME"
                                />
                            </div>

                            {/* ── Phone + Location ── */}
                            <div className="flex items-center justify-center gap-2 text-[12px] text-[#333] mb-0">
                                <input
                                    value={optimized.phone || ""}
                                    onChange={(e) => updateField('phone', e.target.value)}
                                    className="text-center bg-transparent border-b border-transparent hover:border-[#ccc] focus:border-[#3bda71] outline-none w-36 transition-all"
                                    placeholder="+1(123) 456-7890"
                                />
                                <span className="text-[#888]">◇</span>
                                <input
                                    value={optimized.location || ""}
                                    onChange={(e) => updateField('location', e.target.value)}
                                    className="text-center bg-transparent border-b border-transparent hover:border-[#ccc] focus:border-[#3bda71] outline-none w-40 transition-all"
                                    placeholder="San Francisco, CA"
                                />
                            </div>

                            {/* ── Email + LinkedIn + Website ── */}
                            <div className="flex items-center justify-center gap-2 text-[12px] text-[#2563eb] mb-3">
                                <input
                                    value={optimized.email || ""}
                                    onChange={(e) => updateField('email', e.target.value)}
                                    className="text-center bg-transparent border-b border-transparent hover:border-[#ccc] focus:border-[#3bda71] outline-none w-44 text-[#2563eb] transition-all"
                                    placeholder="contact@example.com"
                                />
                                <span className="text-[#888]">◇</span>
                                <input
                                    value={optimized.linkedin || ""}
                                    onChange={(e) => updateField('linkedin', e.target.value)}
                                    className="text-center bg-transparent border-b border-transparent hover:border-[#ccc] focus:border-[#3bda71] outline-none w-44 text-[#2563eb] transition-all"
                                    placeholder="linkedin.com/in/you"
                                />
                                <span className="text-[#888]">◇</span>
                                <input
                                    value={optimized.website || ""}
                                    onChange={(e) => updateField('website', e.target.value)}
                                    className="text-center bg-transparent border-b border-transparent hover:border-[#ccc] focus:border-[#3bda71] outline-none w-32 text-[#2563eb] transition-all"
                                    placeholder="www.you.com"
                                />
                            </div>

                            {/* ═══ OBJECTIVE ════════════════════════════════════════════ */}
                            <div className="mb-2.5">
                                <p className="text-[11.5px] font-black uppercase tracking-wider">OBJECTIVE</p>
                                <hr className="border-t border-black mb-1" />
                                <textarea
                                    value={optimized.summary || ""}
                                    onChange={(e) => updateField('summary', e.target.value)}
                                    className="w-full bg-transparent text-[12.5px] leading-snug border border-transparent hover:border-[#eaeaea] focus:border-[#3bda71] focus:bg-[#fafff9] rounded p-0.5 outline-none resize-none transition-all overflow-hidden"
                                    rows={2}
                                    onInput={(e) => { const t = e.target as HTMLTextAreaElement; t.style.height = "auto"; t.style.height = `${t.scrollHeight}px`; }}
                                />
                            </div>

                            {/* ═══ EDUCATION ════════════════════════════════════════════ */}
                            {(optimized.education && optimized.education.length > 0) && (
                                <div className="mb-1.5">
                                    <p className="text-[11px] font-black uppercase tracking-wider">EDUCATION</p>
                                    <hr className="border-t border-black mb-0.5" />
                                    {optimized.education.map((edu: any, i: number) => (
                                        <div key={i} className="flex items-baseline justify-between mb-0.5">
                                            <div className="flex items-baseline gap-1 flex-1 min-w-0">
                                                <input
                                                    value={edu.degree || ""}
                                                    onChange={(e) => updateEducation(i, 'degree', e.target.value)}
                                                    className="font-bold text-[12.5px] bg-transparent border-b border-transparent hover:border-[#ccc] focus:border-[#3bda71] outline-none flex-shrink-0 transition-all"
                                                    style={{ width: `${Math.max(140, (edu.degree || "").length * 8)}px` }}
                                                    placeholder="Degree"
                                                />
                                                <span className="text-[12.5px]">,</span>
                                                <input
                                                    value={edu.school || ""}
                                                    onChange={(e) => updateEducation(i, 'school', e.target.value)}
                                                    className="text-[12.5px] bg-transparent border-b border-transparent hover:border-[#ccc] focus:border-[#3bda71] outline-none flex-1 min-w-[80px] transition-all"
                                                    placeholder="University"
                                                />
                                            </div>
                                            <div className="flex flex-col items-end flex-shrink-0 ml-2">
                                                <input
                                                    value={edu.endDate || edu.year || ""}
                                                    onChange={(e) => updateEducation(i, 'endDate', e.target.value)}
                                                    className="text-[12.5px] text-right bg-transparent border-b border-transparent hover:border-[#ccc] focus:border-[#3bda71] outline-none w-28 transition-all"
                                                    placeholder="Year"
                                                />
                                                {edu.gpa && (
                                                    <input
                                                        value={edu.gpa || ""}
                                                        onChange={(e) => updateEducation(i, 'gpa', e.target.value)}
                                                        className="text-[11.5px] text-right bg-transparent border-b border-transparent hover:border-[#ccc] focus:border-[#3bda71] outline-none w-28 transition-all text-[#444]"
                                                        placeholder="GPA"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* ═══ SKILLS ════════════════════════════════════════════ */}
                            {optimized.skills && Object.keys(getSkillsObj()).length > 0 && (
                                <div className="mb-2">
                                    <p className="text-[11px] font-black uppercase tracking-wider">SKILLS</p>
                                    <hr className="border-t border-black mb-0.5" />
                                    <table className="text-[12px] w-full border-separate" style={{ borderSpacing: '0 1px' }}>
                                        <tbody>
                                            {Object.entries(getSkillsObj()).map(([cat, items]) => (
                                                <tr key={cat} className="align-top">
                                                    <td className="font-bold pr-6 whitespace-nowrap w-36">{cat}</td>
                                                    <td>
                                                        <div className="flex flex-wrap gap-x-0.5">
                                                            {(items as string[]).map((s: string, i: number) => (
                                                                <span key={i} className="flex items-center">
                                                                    <input
                                                                        value={s}
                                                                        onChange={(e) => updateSkillInCategory(cat, i, e.target.value)}
                                                                        className="bg-transparent border-b border-transparent hover:border-[#ccc] focus:border-[#3bda71] outline-none transition-all text-[12px]"
                                                                        style={{ width: `${Math.max(30, s.length * 7.5)}px` }}
                                                                    />
                                                                    {i < (items as string[]).length - 1 && <span className="mr-1 text-[#555]">,</span>}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* ═══ EXPERIENCE ════════════════════════════════════════ */}
                            {(optimized.experience && optimized.experience.length > 0) && (
                                <div className="mb-1.5">
                                    <p className="text-[11px] font-black uppercase tracking-wider">EXPERIENCE</p>
                                    <hr className="border-t border-black mb-0.5" />
                                    {optimized.experience.map((exp: any, i: number) => (
                                        <div key={i} className="mb-1">
                                            {/* Role ← → Date */}
                                            <div className="flex items-baseline justify-between gap-2">
                                                <input
                                                    value={exp.role || ""}
                                                    onChange={(e) => updateExperience(i, 'role', e.target.value)}
                                                    className="font-bold text-[12.5px] bg-transparent border-b border-transparent hover:border-[#ccc] focus:border-[#3bda71] outline-none flex-1 transition-all"
                                                    placeholder="Role Name"
                                                />
                                                <div className="flex items-center gap-1 flex-shrink-0 text-[12.5px] text-[#333]">
                                                    <input
                                                        value={exp.startDate || ""}
                                                        onChange={(e) => updateExperience(i, 'startDate', e.target.value)}
                                                        className="bg-transparent border-b border-transparent hover:border-[#ccc] focus:border-[#3bda71] outline-none w-20 text-right transition-all"
                                                        placeholder="Jan 2022"
                                                    />
                                                    <span>-</span>
                                                    <input
                                                        value={exp.endDate || ""}
                                                        onChange={(e) => updateExperience(i, 'endDate', e.target.value)}
                                                        className="bg-transparent border-b border-transparent hover:border-[#ccc] focus:border-[#3bda71] outline-none w-20 transition-all"
                                                        placeholder="Jan 2024"
                                                    />
                                                </div>
                                            </div>
                                            {/* Company ← → Location (italic) */}
                                            <div className="flex items-baseline justify-between gap-2 mb-1">
                                                <input
                                                    value={exp.company || ""}
                                                    onChange={(e) => updateExperience(i, 'company', e.target.value)}
                                                    className="text-[12.5px] bg-transparent border-b border-transparent hover:border-[#ccc] focus:border-[#3bda71] outline-none flex-1 transition-all"
                                                    placeholder="Company Name"
                                                />
                                                <input
                                                    value={exp.location || ""}
                                                    onChange={(e) => updateExperience(i, 'location', e.target.value)}
                                                    className="italic text-[12.5px] text-right bg-transparent border-b border-transparent hover:border-[#ccc] focus:border-[#3bda71] outline-none w-36 flex-shrink-0 transition-all"
                                                    placeholder="City, ST"
                                                />
                                            </div>
                                            {/* Bullets */}
                                            <ul className="list-none pl-2 space-y-0">
                                                {(exp.bullets || []).map((b: string, j: number) => (
                                                    <li key={j} className="flex items-start gap-1.5">
                                                        <span className="mt-[3px] text-[11px] flex-shrink-0">•</span>
                                                        <textarea
                                                            value={b}
                                                            onChange={(e) => updateExperienceBullet(i, j, e.target.value)}
                                                            className="w-full bg-transparent text-[12.5px] leading-snug border border-transparent hover:border-[#eaeaea] focus:border-[#3bda71] focus:bg-[#fafff9] rounded p-0.5 outline-none resize-none transition-all overflow-hidden"
                                                            rows={1}
                                                            onInput={(e) => { const t = e.target as HTMLTextAreaElement; t.style.height = "auto"; t.style.height = `${t.scrollHeight}px`; }}
                                                        />
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* ═══ PROJECTS ════════════════════════════════════════ */}
                            {(optimized.projects && optimized.projects.length > 0) && (
                                <div className="mb-1.5">
                                    <p className="text-[11px] font-black uppercase tracking-wider">PROJECTS</p>
                                    <hr className="border-t border-black mb-0.5" />
                                    {optimized.projects.map((proj: any, i: number) => (
                                        <div key={i} className="mb-1 text-[12.5px] leading-snug">
                                            <div className="flex items-start gap-1 flex-wrap">
                                                <span>•</span>
                                                <input
                                                    value={proj.name || proj.title || ""}
                                                    onChange={(e) => {
                                                        const newProj = [...(optimized.projects || [])];
                                                        newProj[i] = { ...newProj[i], name: e.target.value };
                                                        updateField('projects', newProj);
                                                    }}
                                                    className="font-bold bg-transparent border-b border-transparent hover:border-[#ccc] focus:border-[#3bda71] outline-none transition-all"
                                                    style={{ width: `${Math.max(80, ((proj.name || proj.title || "").length + 2) * 8)}px` }}
                                                    placeholder="Project Title"
                                                />
                                                <span className="font-bold">.</span>
                                                <textarea
                                                    value={proj.description || ""}
                                                    onChange={(e) => {
                                                        const newProj = [...(optimized.projects || [])];
                                                        newProj[i] = { ...newProj[i], description: e.target.value };
                                                        updateField('projects', newProj);
                                                    }}
                                                    className="flex-1 min-w-[200px] bg-transparent border border-transparent hover:border-[#eaeaea] focus:border-[#3bda71] focus:bg-[#fafff9] rounded p-0.5 outline-none resize-none transition-all overflow-hidden"
                                                    rows={1}
                                                    onInput={(e) => { const t = e.target as HTMLTextAreaElement; t.style.height = "auto"; t.style.height = `${t.scrollHeight}px`; }}
                                                    placeholder="Project description..."
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* ═══ EXTRA-CURRICULAR ACTIVITIES ══════════════════════ */}
                            {(optimized.extracurriculars && optimized.extracurriculars.length > 0) && (
                                <div className="mb-1.5">
                                    <p className="text-[11px] font-black uppercase tracking-wider">EXTRA-CURRICULAR ACTIVITIES</p>
                                    <hr className="border-t border-black mb-0.5" />
                                    <ul className="list-none pl-2 space-y-0.5">
                                        {optimized.extracurriculars.map((ex: string, i: number) => (
                                            <li key={i} className="flex items-start gap-1">
                                                <span className="mt-[3px] text-[10px] flex-shrink-0">•</span>
                                                <textarea
                                                    value={ex}
                                                    onChange={(e) => updateExtracurricular(i, e.target.value)}
                                                    className="w-full bg-transparent text-[12.5px] leading-snug border border-transparent hover:border-[#eaeaea] focus:border-[#3bda71] focus:bg-[#fafff9] rounded p-0.5 outline-none resize-none transition-all overflow-hidden"
                                                    rows={1}
                                                    onInput={(e) => { const t = e.target as HTMLTextAreaElement; t.style.height = "auto"; t.style.height = `${t.scrollHeight}px`; }}
                                                />
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* ═══ LEADERSHIP ════════════════════════════════════════ */}
                            {(optimized.leadership && optimized.leadership.length > 0) && (
                                <div className="mb-2">
                                    <p className="text-[11.5px] font-black uppercase tracking-wider">LEADERSHIP</p>
                                    <hr className="border-t border-black mb-2" />
                                    <ul className="list-none pl-3 space-y-1">
                                        {optimized.leadership.map((lead: string, i: number) => (
                                            <li key={i} className="flex items-start gap-1.5">
                                                <span className="mt-[3px] text-[11px] flex-shrink-0">•</span>
                                                <textarea
                                                    value={lead}
                                                    onChange={(e) => updateLeadership(i, e.target.value)}
                                                    className="w-full bg-transparent text-[13px] leading-snug border border-transparent hover:border-[#eaeaea] focus:border-[#3bda71] focus:bg-[#fafff9] rounded p-0.5 outline-none resize-none transition-all overflow-hidden"
                                                    rows={1}
                                                    onInput={(e) => { const t = e.target as HTMLTextAreaElement; t.style.height = "auto"; t.style.height = `${t.scrollHeight}px`; }}
                                                />
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                        </div>{/* end paper */}
                        <div className="h-10" />
                    </>
                ) : stage === "processing" ? (
                    <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                        <KineticDotsLoader />
                        <p className="text-[#555] text-[15px] font-medium mt-[-20px]">Tailoring your resume…</p>
                        <p className="text-[#999] text-[13px]">Parsing PDF · Structuring data</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center gap-3">
                        <svg className="w-14 h-14 text-[#c0c0c0]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-[#aaa] text-[15px]">Your tailored resume will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

