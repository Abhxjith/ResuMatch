/**
 * PDF generation using pdf-lib (no Chrome, fast, works on Vercel).
 */
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

const MARGIN = 55;
const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;
const LINE_HEIGHT = 14;
const SECTION_GAP = 10;

const normaliseSkills = (skills: any): Record<string, string[]> => {
    if (!skills) return {};
    if (Array.isArray(skills)) return { 'Technical Skills': skills };
    return skills as Record<string, string[]>;
};

function sanitize(str: any): string {
    if (str == null) return '';
    return String(str).slice(0, 500);
}

export async function generateLatex(resumeData: any): Promise<{ latexSource: string; pdfPath: string }> {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const fontBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
    const black = rgb(0.1, 0.1, 0.1);

    let y = PAGE_HEIGHT - MARGIN;

    const drawText = (text: string, x: number, opts: { size?: number; bold?: boolean; maxWidth?: number } = {}) => {
        const size = opts.size ?? 11;
        const f = opts.bold ? fontBold : font;
        const safe = sanitize(text);
        if (!safe) return;
        const lines = opts.maxWidth ? wrap(safe, opts.maxWidth, f, size) : [safe];
        for (const line of lines) {
            if (y < MARGIN + 20) break;
            page.drawText(line, { x, y, size, font: f, color: black });
            y -= size + 2;
        }
    };

    const wrap = (text: string, width: number, f: any, size: number): string[] => {
        const words = text.split(' ');
        const lines: string[] = [];
        let line = '';
        for (const w of words) {
            const test = line ? `${line} ${w}` : w;
            const ww = f.widthOfTextAtSize(test, size);
            if (ww > width && line) {
                lines.push(line);
                line = w;
            } else {
                line = test;
            }
        }
        if (line) lines.push(line);
        return lines;
    };

    const contentWidth = PAGE_WIDTH - 2 * MARGIN;

    // Header
    const name = sanitize(resumeData.name || 'Your Name').toUpperCase();
    const nameW = fontBold.widthOfTextAtSize(name, 18);
    page.drawText(name, { x: MARGIN + (contentWidth - nameW) / 2, y, size: 18, font: fontBold, color: black });
    y -= 22;

    const contactParts = [resumeData.phone, resumeData.location].filter(Boolean).map(sanitize);
    if (contactParts.length) {
        drawText(contactParts.join('  •  '), MARGIN + contentWidth / 2 - font.widthOfTextAtSize(contactParts.join('  •  '), 9) / 2, { size: 9 });
    }
    const contact2 = [resumeData.email, resumeData.linkedin, resumeData.website].filter(Boolean).map(sanitize);
    if (contact2.length) {
        const t = contact2.join('  •  ');
        drawText(t, MARGIN + contentWidth / 2 - font.widthOfTextAtSize(t, 9) / 2, { size: 9 });
    }
    y -= SECTION_GAP;

    const section = (title: string, fn: () => void) => {
        y -= 4;
        page.drawText(title, { x: MARGIN, y, size: 10, font: fontBold, color: black });
        y -= 4;
        page.drawLine({
            start: { x: MARGIN, y },
            end: { x: PAGE_WIDTH - MARGIN, y },
            thickness: 0.5,
            color: black
        });
        y -= 8;
        fn();
        y -= SECTION_GAP;
    };

    if (resumeData.summary) {
        section('PROFESSIONAL SUMMARY', () => drawText(sanitize(resumeData.summary), MARGIN, { size: 10, maxWidth: contentWidth }));
    }

    if ((resumeData.education || []).length) {
        section('EDUCATION', () => {
            for (const edu of resumeData.education) {
                const deg = sanitize(edu.degree || edu.title);
                const school = edu.school ? `, ${sanitize(edu.school)}` : '';
                const dateStr = [edu.endDate, edu.gpa].filter(Boolean).join('  ');
                page.drawText(`${deg}${school}`, { x: MARGIN, y, size: 10, font: fontBold, color: black });
                if (dateStr) {
                    const w = font.widthOfTextAtSize(dateStr, 10);
                    page.drawText(dateStr, { x: PAGE_WIDTH - MARGIN - w, y, size: 10, font, color: black });
                }
                y -= 14;
            }
        });
    }

    const skillsObj = normaliseSkills(resumeData.skills);
    const skillsEntries = Object.entries(skillsObj).filter(([, v]) => (v as string[]).length > 0);
    if (skillsEntries.length) {
        section('SKILLS', () => {
            for (const [cat, items] of skillsEntries) {
                drawText(`${sanitize(cat)}: ${(items as string[]).map(sanitize).join(', ')}`, MARGIN, { size: 10, maxWidth: contentWidth });
            }
        });
    }

    if ((resumeData.experience || []).length) {
        section('WORK EXPERIENCE', () => {
            for (const exp of resumeData.experience) {
                const role = sanitize(exp.role);
                const dates = `${exp.startDate || ''} – ${exp.endDate || 'Present'}`.trim();
                const dateW = font.widthOfTextAtSize(dates, 10);
                page.drawText(role, { x: MARGIN, y, size: 10, font: fontBold, color: black });
                page.drawText(dates, { x: PAGE_WIDTH - MARGIN - dateW, y, size: 10, font, color: black });
                y -= 12;
                const sub = [exp.company, exp.location].filter(Boolean).map(sanitize).join(', ');
                if (sub) drawText(sub, MARGIN, { size: 10 });
                for (const b of exp.bullets || []) {
                    drawText(`• ${sanitize(b)}`, MARGIN + 12, { size: 10, maxWidth: contentWidth - 12 });
                }
                y -= 4;
            }
        });
    }

    if ((resumeData.projects || []).length) {
        section('PROJECTS', () => {
            for (const p of resumeData.projects) {
                const name = sanitize(p.name || p.title);
                const desc = sanitize(p.description || (p.bullets || []).join(' '));
                drawText(`${name}. ${desc}`, MARGIN, { size: 10, maxWidth: contentWidth });
            }
        });
    }

    if ((resumeData.extracurriculars || []).length) {
        section('EXTRA-CURRICULAR ACTIVITIES', () => {
            for (const ex of resumeData.extracurriculars) {
                drawText(`• ${sanitize(ex)}`, MARGIN, { size: 10, maxWidth: contentWidth });
            }
        });
    }

    if ((resumeData.leadership || []).length) {
        section('LEADERSHIP', () => {
            for (const l of resumeData.leadership) {
                drawText(`• ${sanitize(l)}`, MARGIN, { size: 10, maxWidth: contentWidth });
            }
        });
    }

    if ((resumeData.certifications || []).length) {
        section('CERTIFICATIONS', () => {
            for (const c of resumeData.certifications) {
                const line = typeof c === 'string' ? c : sanitize(c.name || c.title || c);
                drawText(`• ${line}`, MARGIN, { size: 10, maxWidth: contentWidth });
            }
        });
    }

    const pdfBytes = await pdfDoc.save();
    const pdfPath = path.join(os.tmpdir(), `resume_${Date.now()}.pdf`);
    fs.writeFileSync(pdfPath, pdfBytes);

    // Store JSON as latexSource for DB; frontend uses optimizedJson for display
    return { latexSource: JSON.stringify(resumeData), pdfPath };
}

export async function compileLatexSource(_unused: string): Promise<{ latexSource: string; pdfPath: string }> {
    throw new Error('Use generateLatex with resume JSON instead');
}
