import { Request, Response } from 'express';
import * as resumeParser from '../services/resumeParser';
import * as geminiOptimizer from '../services/geminiOptimizer';
import * as latexGenerator from '../services/latexGenerator';
import * as resumeSessionService from '../services/resumeSessionService';

export const uploadResume = async (req: Request, res: Response) => {
    res.json({ message: "Upload resume endpoint placeholder", data: null });
};

export const generateResume = async (req: Request, res: Response) => {
    res.json({ message: "Generate resume endpoint placeholder", data: null });
};

export const updateResume = async (req: Request, res: Response) => {
    try {
        const { id, updatedResumeJson } = req.body;

        if (!id || !updatedResumeJson) {
            return res.status(400).json({ success: false, message: "Missing id or updatedResumeJson in request body" });
        }

        // 1. Regenerate LaTeX from the updated JSON strictly
        const { latexSource, pdfPath } = await latexGenerator.generateLatex(updatedResumeJson);

        // 2. Update the stored session JSON, LaTeX, and PDF path
        await resumeSessionService.updateResumeSession(id, updatedResumeJson, latexSource, pdfPath);

        // 3. Return the updated preview data
        res.status(200).json({
            success: true,
            message: "Resume updated successfully",
            data: {
                id,
                updatedResumeJson,
                latexSource,
                pdfPath
            }
        });
    } catch (error: any) {
        console.error("Error updating resume:", error);
        res.status(500).json({ success: false, message: "Server error during resume update", error: error.message });
    }
};

export const downloadResume = async (req: Request, res: Response) => {
    res.json({ message: "Download resume endpoint placeholder", data: null });
};

export const getHistory = async (req: Request, res: Response) => {
    res.json({ message: "History endpoint placeholder", data: null });
};
