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

## Vercel deployment

1. Deploy the backend (Railway, Render, etc.) and note its URL.
2. In Vercel → Project → Settings → Environment Variables:
   - `NEXT_PUBLIC_BACKEND_URL` = your backend URL (e.g. `https://your-backend.up.railway.app`)
3. The frontend proxies API calls via `/api/backend/*` to avoid `ERR_BLOCKED_BY_CLIENT` (cross-origin blocking).
