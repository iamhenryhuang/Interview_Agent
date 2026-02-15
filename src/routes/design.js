/**
 * src/routes/design.js
 * System Design 路由 — 取題（本地）+ 評估 + 總結
 */
const express = require('express');
const { callGemini } = require('../gemini');
const { buildDesignEvaluationPrompt } = require('../prompts/design');
const { buildSpecializedSummaryPrompt } = require('../prompts/summary');
const { selectDesignQuestions } = require('../data/design-questions');

const router = express.Router();

/** POST /api/start-system-design — 從本地題庫取得題目（不消耗 API） */
router.post('/start-system-design', (req, res) => {
    try {
        const { count = 2, difficulty = 'mixed' } = req.body;
        const questions = selectDesignQuestions(count, difficulty);

        res.json({ success: true, questions });
    } catch (err) {
        console.error('[design/start]', err.message);
        res.status(500).json({ error: err.message || '取得題目失敗' });
    }
});

/** POST /api/evaluate-design — 評估設計方案 */
router.post('/evaluate-design', async (req, res) => {
    try {
        const { problem, answer } = req.body;

        if (!problem || !answer) {
            return res.status(400).json({ error: '缺少題目或回答' });
        }

        const prompt = buildDesignEvaluationPrompt(problem, answer);
        const result = await callGemini(prompt);

        res.json({ success: true, ...result });
    } catch (err) {
        console.error('[design/evaluate]', err.message);
        res.status(500).json({ error: err.message || '設計評分失敗' });
    }
});

/** POST /api/specialized-summary — Coding / Design 面試總結 */
router.post('/specialized-summary', async (req, res) => {
    try {
        const { qaHistory, mode } = req.body;

        if (!qaHistory?.length) {
            return res.status(400).json({ error: '缺少面試問答記錄' });
        }

        const prompt = buildSpecializedSummaryPrompt(qaHistory, mode);
        const result = await callGemini(prompt);

        res.json({ success: true, ...result });
    } catch (err) {
        console.error('[design/summary]', err.message);
        res.status(500).json({ error: err.message || '生成總結失敗' });
    }
});

module.exports = router;
