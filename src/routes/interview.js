/**
 * src/routes/interview.js
 * 傳統面試路由 — 出題、評估、總結
 */
const express = require('express');
const { callGemini } = require('../gemini');
const { buildQuestionPrompt, buildEvaluationPrompt } = require('../prompts/interview');
const { buildSummaryPrompt } = require('../prompts/summary');

const router = express.Router();

/** POST /api/start-interview — 根據履歷生成題目 */
router.post('/start-interview', async (req, res) => {
    try {
        const { resumeText, interviewType = 'mixed', questionCount = 5 } = req.body;

        if (!resumeText) {
            return res.status(400).json({ error: '缺少履歷內容' });
        }

        const prompt = buildQuestionPrompt(resumeText, interviewType, questionCount);
        const result = await callGemini(prompt);

        res.json({ success: true, ...result });
    } catch (err) {
        console.error('[interview/start]', err.message);
        res.status(500).json({ error: err.message || '生成面試題目失敗' });
    }
});

/** POST /api/evaluate-answer — 評估單題回答 */
router.post('/evaluate-answer', async (req, res) => {
    try {
        const { question, answer, resumeContext, keyPoints = [] } = req.body;

        if (!question || !answer) {
            return res.status(400).json({ error: '缺少題目或回答' });
        }

        const prompt = buildEvaluationPrompt(question, answer, resumeContext, keyPoints);
        const result = await callGemini(prompt);

        res.json({ success: true, ...result });
    } catch (err) {
        console.error('[interview/evaluate]', err.message);
        res.status(500).json({ error: err.message || '評分失敗' });
    }
});

/** POST /api/interview-summary — 面試總結報告 */
router.post('/interview-summary', async (req, res) => {
    try {
        const { qaHistory, resumeText } = req.body;

        if (!qaHistory?.length) {
            return res.status(400).json({ error: '缺少面試問答記錄' });
        }

        const prompt = buildSummaryPrompt(qaHistory, resumeText);
        const result = await callGemini(prompt);

        res.json({ success: true, ...result });
    } catch (err) {
        console.error('[interview/summary]', err.message);
        res.status(500).json({ error: err.message || '生成總結失敗' });
    }
});

module.exports = router;
