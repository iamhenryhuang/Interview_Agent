/**
 * src/routes/leetcode.js
 * LeetCode 即時爬題 API 路由
 */
const express = require('express');
const {
    fetchProblemList,
    fetchProblemDetail,
    fetchRandomProblems,
    getAvailableTags,
} = require('../leetcode');

const router = express.Router();

/** GET /api/leetcode/tags — 取得可用 tag 列表 */
router.get('/leetcode/tags', (_req, res) => {
    res.json({ success: true, tags: getAvailableTags() });
});

/** POST /api/leetcode/problems — 取得題目列表（支援篩選） */
router.post('/leetcode/problems', async (req, res) => {
    try {
        const { difficulty, tags, limit = 50, skip = 0 } = req.body;
        const result = await fetchProblemList({ difficulty, tags, limit, skip });
        res.json({ success: true, ...result });
    } catch (err) {
        console.error('[leetcode/problems]', err.message);
        res.status(500).json({ error: err.message || '取得 LeetCode 題目列表失敗' });
    }
});

/** POST /api/leetcode/problem/:slug — 取得單題完整資訊 */
router.post('/leetcode/problem/:slug', async (req, res) => {
    try {
        const detail = await fetchProblemDetail(req.params.slug);
        res.json({ success: true, problem: detail });
    } catch (err) {
        console.error('[leetcode/detail]', err.message);
        res.status(500).json({ error: err.message || '取得題目詳情失敗' });
    }
});

/** POST /api/leetcode/random — 隨機取 N 道 LeetCode 真題 */
router.post('/leetcode/random', async (req, res) => {
    try {
        const { count = 3, difficulty = 'mixed', tags = [] } = req.body;
        const questions = await fetchRandomProblems(count, difficulty, tags);

        if (questions.length === 0) {
            return res.status(404).json({ error: '找不到符合條件的題目' });
        }

        res.json({ success: true, questions });
    } catch (err) {
        console.error('[leetcode/random]', err.message);
        res.status(500).json({ error: err.message || '隨機取題失敗' });
    }
});

module.exports = router;
