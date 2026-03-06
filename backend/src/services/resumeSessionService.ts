import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const updateResumeSession = async (
    id: string,
    updatedResumeJson: any,
    latexSource: string | null,
    pdfPath: string | null
) => {
    return await prisma.resumeSession.update({
        where: { id },
        data: {
            optimizedJson: JSON.stringify(updatedResumeJson),
            latexSource,
            pdfPath
        }
    });
};

export const createSession = async (data: {
    id?: string;
    optimizedJson: string;
    latexSource: string;
    pdfPath: string;
}) => {
    return await prisma.resumeSession.create({ data: data as any });
};

export const getSession = async (id: string) => {
    return await prisma.resumeSession.findUnique({
        where: { id }
    });
};
