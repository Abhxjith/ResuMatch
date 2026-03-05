"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHistory = exports.downloadResume = exports.updateResume = exports.generateResume = exports.uploadResume = void 0;
const latexGenerator = __importStar(require("../services/latexGenerator"));
const resumeSessionService = __importStar(require("../services/resumeSessionService"));
const uploadResume = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json({ message: "Upload resume endpoint placeholder", data: null });
});
exports.uploadResume = uploadResume;
const generateResume = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json({ message: "Generate resume endpoint placeholder", data: null });
});
exports.generateResume = generateResume;
const updateResume = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, updatedResumeJson } = req.body;
        if (!id || !updatedResumeJson) {
            return res.status(400).json({ success: false, message: "Missing id or updatedResumeJson in request body" });
        }
        // 1. Regenerate LaTeX from the updated JSON strictly
        const { latexSource, pdfPath } = yield latexGenerator.generateLatex(updatedResumeJson);
        // 2. Update the stored session JSON, LaTeX, and PDF path
        yield resumeSessionService.updateResumeSession(id, updatedResumeJson, latexSource, pdfPath);
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
    }
    catch (error) {
        console.error("Error updating resume:", error);
        res.status(500).json({ success: false, message: "Server error during resume update", error: error.message });
    }
});
exports.updateResume = updateResume;
const downloadResume = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json({ message: "Download resume endpoint placeholder", data: null });
});
exports.downloadResume = downloadResume;
const getHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json({ message: "History endpoint placeholder", data: null });
});
exports.getHistory = getHistory;
