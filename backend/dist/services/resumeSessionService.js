"use strict";
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
exports.getSession = exports.updateResumeSession = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const updateResumeSession = (id, updatedResumeJson, latexSource, pdfPath) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.resumeSession.update({
        where: { id },
        data: {
            optimizedJson: JSON.stringify(updatedResumeJson),
            latexSource,
            pdfPath
        }
    });
});
exports.updateResumeSession = updateResumeSession;
const getSession = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.resumeSession.findUnique({
        where: { id }
    });
});
exports.getSession = getSession;
