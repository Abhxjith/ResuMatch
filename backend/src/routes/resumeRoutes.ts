import { Router } from 'express';
import {
    uploadResume,
    generateResume,
    updateResume,
    downloadResume,
    getHistory
} from '../controllers/resumeController';

const router = Router();

router.post('/upload-resume', uploadResume);
router.post('/generate-resume', generateResume);
router.patch('/update-resume', updateResume);
router.get('/download-resume/:id', downloadResume);
router.get('/history', getHistory);

export default router;
