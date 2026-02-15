/**
 * server.js — 應用程式入口
 *
 * 職責：設定 middleware、掛載路由、啟動伺服器
 * 業務邏輯全部在 src/ 內的模組中
 */
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

// ── Routes ──────────────────────────────────────────────
const uploadRoutes = require('./src/routes/upload');
const interviewRoutes = require('./src/routes/interview');
const codingRoutes = require('./src/routes/coding');
const designRoutes = require('./src/routes/design');

// ── App setup ───────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Mount routes — all under /api
app.use('/api', uploadRoutes);
app.use('/api', interviewRoutes);
app.use('/api', codingRoutes);
app.use('/api', designRoutes);

// ── Error handler ───────────────────────────────────────
app.use((err, _req, res, _next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: `上傳錯誤：${err.message}` });
    }
    console.error('[server]', err.message);
    res.status(500).json({ error: err.message || '伺服器錯誤' });
});

// ── Start (auto-increment port on conflict) ─────────────
function startServer(port) {
    const server = app.listen(port, () => {
        console.log(`🚀 Interview Agent running at http://localhost:${port}`);
    });

    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.warn(`⚠️  Port ${port} 已被佔用，嘗試 ${port + 1}...`);
            startServer(port + 1);
        } else {
            throw err;
        }
    });
}

startServer(PORT);
