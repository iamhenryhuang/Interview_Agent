/**
 * js/main.js — 前端入口
 *
 * 負責：共享 state、DOM helper、view 切換、loading overlay
 * 各 view 的邏輯分別在 upload / interview / coding / design / result / history.js
 */

// ── Shared State ─────────────────────────────────────────
export const state = {
    resumeText: '',
    interviewType: 'mixed',
    questionCount: 5,
    questions: [],
    currentIndex: 0,
    qaHistory: [],
    currentView: 'viewUpload',
    mode: 'interview', // interview | coding | design
    codingSource: 'local', // local | leetcode
    lcDifficulty: 'mixed',
    lcTags: [],
};

// ── DOM Helper ───────────────────────────────────────────
export function $(id) {
    return document.getElementById(id);
}

// ── Views ────────────────────────────────────────────────
export const views = {
    upload: $('viewUpload'),
    interview: $('viewInterview'),
    coding: $('viewCoding'),
    design: $('viewDesign'),
    result: $('viewResult'),
    history: $('viewHistory'),
};

export function showView(name) {
    Object.values(views).forEach((v) => v.classList.remove('active'));
    if (views[name]) {
        views[name].classList.add('active');
        state.currentView = name;
    }
}

// ── Loading Overlay ──────────────────────────────────────
export function showLoading(text) {
    $('loadingText').textContent = text || '載入中...';
    $('loadingOverlay').classList.remove('hidden');
}

export function hideLoading() {
    $('loadingOverlay').classList.add('hidden');
}

// ── Animate Number ───────────────────────────────────────
export function animateNumber(el, target, decimals = 0) {
    const duration = 600;
    const start = performance.now();

    function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = (target * eased).toFixed(decimals);
        if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
}

// ── Bootstrap — Import View Modules ──────────────────────
// Side-effectful imports: each module registers its own event listeners
import './upload.js';
import './interview.js';
import './coding.js';
import './design.js';
import './result.js';
import './history.js';
