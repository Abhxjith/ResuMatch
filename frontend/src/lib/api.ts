// Use same-origin proxy in browser to avoid ERR_BLOCKED_BY_CLIENT (ad blockers, CORS) on Vercel
const BASE_URL =
    typeof window !== "undefined" ? "/api/backend" : (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001");

export interface OptimizedResume {
    name?: string;
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    website?: string;
    summary: string;
    skills: Record<string, string[]> | string[];  // object (categorized) or legacy flat array
    experience: { role: string; company: string; location?: string; startDate?: string; endDate?: string; bullets: string[] }[];
    projects: any[];
    education: { degree: string; school: string; endDate?: string, gpa?: string }[];
    extracurriculars?: string[];
    leadership?: string[];
}

export interface GenerateResumeResult {
    sessionId: string;
    parsedJson: any;
    optimizedJson: OptimizedResume;
    latexSource: string;
    pdfPath: string;
}

/**
 * Step 1: Upload PDF + job info → returns parsed JSON, optimized JSON, latex source, and pdf path.
 */
export async function generateResume(
    resumeFile: File,
    jobTitle: string,
    jobDescription: string
): Promise<GenerateResumeResult> {
    const formData = new FormData();
    formData.append('resume', resumeFile);
    formData.append('jobTitle', jobTitle);
    formData.append('jobDescription', jobDescription);

    const res = await fetch(`${BASE_URL}/generate-resume`, {
        method: 'POST',
        body: formData,
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to generate resume');
    }
    return json.data as GenerateResumeResult;
}

/**
 * Step 2: Save user edits → re-generates LaTeX + PDF and returns updated data.
 */
export async function updateResume(
    id: string,
    updatedResumeJson?: OptimizedResume,
    latexSource?: string
): Promise<{ id: string; updatedResumeJson: OptimizedResume; latexSource: string; pdfPath: string }> {
    const res = await fetch(`${BASE_URL}/update-resume`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, updatedResumeJson, latexSource }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to update resume');
    }
    return json.data;
}

/**
 * Step 3: Download the compiled PDF for a given session.
 */
export function getDownloadUrl(id: string): string {
    const base = typeof window !== "undefined" ? "/api/backend" : (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001");
    return `${base}/download-resume/${id}`;
}

/**
 * Fetch session history.
 */
export async function fetchHistory(): Promise<any[]> {
    const res = await fetch(`${BASE_URL}/history`);
    const json = await res.json();
    return json.data || [];
}
