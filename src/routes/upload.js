/**
 * src/routes/upload.js
 * 履歷 PDF 上傳 & 解析
 */
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');

const router = express.Router();

// Multer config
const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const upload = multer({
    dest: uploadsDir,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter(_req, file, cb) {
        file.mimetype === 'application/pdf'
            ? cb(null, true)
            : cb(new Error('只接受 PDF 檔案'));
    },
});

/**
 * POST /api/upload-resume
 * Accept PDF → parse text → return result
 */
router.post('/upload-resume', upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: '請上傳 PDF 檔案' });
        }

        const buf = fs.readFileSync(req.file.path);
        const pdf = await pdfParse(buf);

        // cleanup temp file
        fs.unlinkSync(req.file.path);

        const text = pdf.text.trim();
        if (!text) {
            return res.status(400).json({ error: 'PDF 中未找到可讀取的文字內容' });
        }

        res.json({
            success: true,
            resumeText: text,
            pageCount: pdf.numpages,
            charCount: text.length,
        });
    } catch (err) {
        console.error('[upload]', err.message);
        res.status(500).json({ error: err.message || '檔案處理失敗' });
    }
});

module.exports = router;
