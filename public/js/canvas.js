/**
 * js/canvas.js
 * Canvas 繪圖 — Score Circle & Radar Chart
 */

const ACCENT = '#646cff';
const CYAN = '#00e5ff';
const GRID = 'rgba(100, 108, 255, 0.12)';
const RING_BG = 'rgba(100, 108, 255, 0.15)';
const LABEL_COLOR = '#a0a0b8';

/**
 * 畫出分數圓環
 * @param {string} canvasId  canvas 元素 id
 * @param {number} score     0–10
 */
export function drawScoreCircle(canvasId, score) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const size = 200;

    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const r = 80;
    const lw = 6;

    // Background ring
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = RING_BG;
    ctx.lineWidth = lw;
    ctx.stroke();

    // Score arc
    const pct = score / 10;
    const startAngle = -Math.PI / 2;
    const endAngle = startAngle + pct * Math.PI * 2;

    ctx.beginPath();
    ctx.arc(cx, cy, r, startAngle, endAngle);
    ctx.strokeStyle = ACCENT;
    ctx.lineWidth = lw;
    ctx.lineCap = 'round';
    ctx.stroke();
}

/**
 * 畫出五維雷達圖
 * @param {string} canvasId
 * @param {object} dims  e.g. { technicalSkill: 8, problemSolving: 7, ... }
 */
export function drawRadarChart(canvasId, dims) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const size = 400;

    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = Math.min(size, window.innerWidth - 100) + 'px';
    canvas.style.height = Math.min(size, window.innerWidth - 100) + 'px';
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const maxR = 150;

    const labels = ['技術能力', '問題解決', '溝通能力', '文化契合', '發展潛力'];
    const keys = ['technicalSkill', 'problemSolving', 'communication', 'cultureFit', 'potential'];
    const values = keys.map((k) => (dims[k] || 0) / 10);
    const n = labels.length;

    // Grid rings
    for (let ring = 1; ring <= 5; ring++) {
        const r = (ring / 5) * maxR;
        ctx.beginPath();
        for (let i = 0; i <= n; i++) {
            const angle = (i * 2 * Math.PI) / n - Math.PI / 2;
            const x = cx + r * Math.cos(angle);
            const y = cy + r * Math.sin(angle);
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = GRID;
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    // Axes
    for (let i = 0; i < n; i++) {
        const angle = (i * 2 * Math.PI) / n - Math.PI / 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + maxR * Math.cos(angle), cy + maxR * Math.sin(angle));
        ctx.strokeStyle = GRID;
        ctx.stroke();
    }

    // Data polygon
    ctx.beginPath();
    for (let i = 0; i <= n; i++) {
        const idx = i % n;
        const angle = (idx * 2 * Math.PI) / n - Math.PI / 2;
        const r = values[idx] * maxR;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.fillStyle = GRID;
    ctx.fill();
    ctx.strokeStyle = ACCENT;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Data points
    for (let i = 0; i < n; i++) {
        const angle = (i * 2 * Math.PI) / n - Math.PI / 2;
        const r = values[i] * maxR;
        ctx.beginPath();
        ctx.arc(cx + r * Math.cos(angle), cy + r * Math.sin(angle), 4, 0, Math.PI * 2);
        ctx.fillStyle = CYAN;
        ctx.fill();
    }

    // Labels
    ctx.fillStyle = LABEL_COLOR;
    ctx.font = '13px Inter, sans-serif';
    ctx.textAlign = 'center';

    for (let i = 0; i < n; i++) {
        const angle = (i * 2 * Math.PI) / n - Math.PI / 2;
        const labelR = maxR + 28;
        let x = cx + labelR * Math.cos(angle);
        let y = cy + labelR * Math.sin(angle);

        if (Math.abs(Math.cos(angle)) < 0.1) {
            y += Math.sin(angle) > 0 ? 8 : -4;
        }

        ctx.fillText(`${labels[i]} (${dims[keys[i]] || 0})`, x, y);
    }
}
