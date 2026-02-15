/**
 * src/routes/coding.js
 * Coding Test 路由 — 取題（本地）+ 評估
 */
const express = require('express');
const { callGemini } = require('../gemini');
const { buildCodeEvaluationPrompt } = require('../prompts/coding');
const { selectCodingQuestions } = require('../data/coding-questions');

const router = express.Router();

/** POST /api/start-coding-test — 從本地題庫取得題目（不消耗 API） */
router.post('/start-coding-test', (req, res) => {
    try {
        const { count = 3, difficulty = 'mixed' } = req.body;
        const questions = selectCodingQuestions(count, difficulty);

        res.json({ success: true, questions });
    } catch (err) {
        console.error('[coding/start]', err.message);
        res.status(500).json({ error: err.message || '取得題目失敗' });
    }
});

/** POST /api/evaluate-code — 評估程式碼 */
router.post('/evaluate-code', async (req, res) => {
    try {
        const { problem, code, language = 'javascript' } = req.body;

        if (!problem || !code) {
            return res.status(400).json({ error: '缺少題目或程式碼' });
        }

        const prompt = buildCodeEvaluationPrompt(problem, code, language);
        const result = await callGemini(prompt);

        res.json({ success: true, ...result });
    } catch (err) {
        console.error('[coding/evaluate]', err.message);
        res.status(500).json({ error: err.message || '程式碼評分失敗' });
    }
});

module.exports = router;
