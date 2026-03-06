# ResuMatch

AI-powered resume optimization. Upload your resume, paste a job description, and get a tailored PDF in seconds using Gemini.

**Live app:** [theresumatch.vercel.app](https://theresumatch.vercel.app)

## Stack

- **Frontend:** Next.js, React, Tailwind CSS, Firebase Auth
- **Backend:** Node.js, Express, Prisma, Google Gemini
- **PDF:** pdf-lib, unpdf

## Local setup

```bash
# Backend
cd backend && pnpm install && pnpm dev

# Frontend (separate terminal)
cd frontend && pnpm install && pnpm dev
```

Add `.env` with `GEMINI_API_KEY` and Prisma DB URL in `backend/`.
