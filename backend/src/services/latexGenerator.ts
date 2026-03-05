import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import puppeteer from 'puppeteer';

// ─── Helpers ─────────────────────────────────────────────────────────────────
const e = (str: any): string => {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
};

// Normalise skills: { "Languages": [...] } OR string[]
const normaliseSkills = (skills: any): Record<string, string[]> => {
    if (!skills) return {};
    if (Array.isArray(skills)) return { 'Technical Skills': skills };
    return skills as Record<string, string[]>;
};

// ─── HTML Template ────────────────────────────────────────────────────────────
const buildResumeHtml = (data: any): string => {
    const skillsObj = normaliseSkills(data.skills);

    const skillsRows = Object.entries(skillsObj)
        .filter(([, items]) => (items as string[]).length > 0)
        .map(([cat, items]) =>
            `<tr><td class="skill-label">${e(cat)}</td><td>${(items as string[]).map(e).join(', ')}</td></tr>`
        ).join('');

    const educationRows = (data.education || []).map((edu: any) => `
        <div class="edu-row">
            <span><strong>${e(edu.degree || edu.title)}</strong>${edu.school ? `, ${e(edu.school)}` : ''}</span>
            <div style="text-align: right;">
                <span class="date">${e(edu.endDate || edu.year || '')}</span>
                ${edu.gpa ? `<br/><span style="font-size: 9.5pt; color: #444;">${e(edu.gpa)}</span>` : ''}
            </div>
        </div>`).join('');

    const experienceBlocks = (data.experience || []).map((exp: any) => `
        <div class="exp-block">
            <div class="exp-header">
                <strong>${e(exp.role)}</strong>
                <span class="date">${e(exp.startDate)}${exp.startDate || exp.endDate ? ' – ' : ''}${e(exp.endDate || 'Present')}</span>
            </div>
            <div class="exp-sub">
                <span>${e(exp.company)}</span>
                <em>${e(exp.location)}</em>
            </div>
            <ul>${(exp.bullets || []).map((b: string) => `<li>${e(b)}</li>`).join('')}</ul>
        </div>`).join('');

    const projectItems = (data.projects || []).map((proj: any) => `
        <li><strong>${e(proj.name || proj.title)}.</strong> ${e(proj.description || (proj.bullets || []).join(' '))}</li>`
    ).join('');

    const extraItems = (data.extracurriculars || []).map((ex: string) => `<li>${e(ex)}</li>`).join('');
    const leadershipItems = (data.leadership || []).map((l: string) => `<li>${e(l)}</li>`).join('');

    const section = (title: string, content: string) =>
        content.trim() ? `<div class="section"><p class="section-title">${title}</p><hr/>${content}</div>` : '';

    // Contact line
    const contact1 = [data.phone, data.location].filter(Boolean).map(e).join(' &nbsp;◇&nbsp; ');
    const contact2Parts = [];
    if (data.email) contact2Parts.push(`<a href="mailto:${e(data.email)}">${e(data.email)}</a>`);
    if (data.linkedin) contact2Parts.push(`<a href="https://${e(data.linkedin)}">${e(data.linkedin)}</a>`);
    if (data.website) contact2Parts.push(`<a href="https://${e(data.website)}">${e(data.website)}</a>`);
    const contact2 = contact2Parts.join(' &nbsp;◇&nbsp; ');

    return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Times New Roman', Times, serif;
    font-size: 11pt;
    color: #111;
    padding: 0.55in 0.55in;
    line-height: 1.25;
  }
  a { color: #1a56db; text-decoration: none; }

  /* Header */
  .name {
    text-align: center;
    font-size: 20pt;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    margin-bottom: 2px;
  }
  .contact { text-align: center; font-size: 9.5pt; margin-bottom: 1px; }
  .contact-links { text-align: center; font-size: 9.5pt; color: #1a56db; margin-bottom: 8px; }

  /* Sections */
  .section { margin-bottom: 7px; }
  .section-title {
    font-size: 9.5pt;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }
  hr { border: none; border-top: 1px solid #111; margin: 1px 0 3px; }

  /* Objective */
  .objective { font-size: 10.5pt; }

  /* Education */
  .edu-row {
    display: flex;
    justify-content: space-between;
    font-size: 10.5pt;
    margin-bottom: 1px;
  }

  /* Skills */
  .skills-table { border-collapse: collapse; width: 100%; font-size: 10.5pt; }
  .skill-label { font-weight: 700; white-space: nowrap; padding-right: 24px; vertical-align: top; }

  /* Experience */
  .exp-block { margin-bottom: 5px; }
  .exp-header {
    display: flex;
    justify-content: space-between;
    font-size: 10.5pt;
  }
  .exp-sub {
    display: flex;
    justify-content: space-between;
    font-size: 10.5pt;
    margin-bottom: 1px;
  }
  ul { padding-left: 14px; font-size: 10.5pt; }
  li { margin-bottom: 0px; }

  /* Projects */
  .projects-list { padding-left: 14px; font-size: 10.5pt; }
  .projects-list li { margin-bottom: 1px; }

  .date { white-space: nowrap; font-size: 10.5pt; }
</style>
</head>
<body>
  <div class="name">${e(data.name || 'Your Name')}</div>
  ${contact1 ? `<div class="contact">${contact1}</div>` : ''}
  ${contact2 ? `<div class="contact-links">${contact2}</div>` : ''}

  ${section('OBJECTIVE', `<p class="objective">${e(data.summary)}</p>`)}
  ${section('EDUCATION', educationRows)}
  ${skillsRows ? section('SKILLS', `<table class="skills-table"><tbody>${skillsRows}</tbody></table>`) : ''}
  ${section('EXPERIENCE', experienceBlocks)}
  ${projectItems ? section('PROJECTS', `<ul class="projects-list">${projectItems}</ul>`) : ''}
  ${extraItems ? section('EXTRA-CURRICULAR ACTIVITIES', `<ul>${extraItems}</ul>`) : ''}
  ${leadershipItems ? section('LEADERSHIP', `<ul>${leadershipItems}</ul>`) : ''}
</body>
</html>`;
};

// ─── Public API ───────────────────────────────────────────────────────────────
export const generateLatex = async (resumeData: any): Promise<{ latexSource: string; pdfPath: string }> => {
    const html = buildResumeHtml(resumeData);
    const pdfPath = path.join(os.tmpdir(), `resume_${Date.now()}.pdf`);

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    try {
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });
        await page.pdf({
            path: pdfPath,
            format: 'Letter',
            printBackground: true,
            margin: { top: '0in', bottom: '0in', left: '0in', right: '0in' },
        });
    } finally {
        await browser.close();
    }

    return { latexSource: html, pdfPath };
};

// Kept for backward-compat with /update-resume which calls compileLatexSource directly
export const compileLatexSource = async (htmlSource: string): Promise<{ latexSource: string; pdfPath: string }> => {
    const pdfPath = path.join(os.tmpdir(), `resume_${Date.now()}.pdf`);

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    try {
        const page = await browser.newPage();
        await page.setContent(htmlSource, { waitUntil: 'networkidle0' });
        await page.pdf({
            path: pdfPath,
            format: 'Letter',
            printBackground: true,
            margin: { top: '0in', bottom: '0in', left: '0in', right: '0in' },
        });
    } finally {
        await browser.close();
    }
    return { latexSource: htmlSource, pdfPath };
};
