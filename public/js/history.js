/**
 * js/history.js
 * 歷史記錄 — localStorage CRUD + 列表渲染
 */
import { state, $, showView } from './main.js';

const STORAGE_KEY = 'interviewHistory';
const MAX_RECORDS = 20;

/** 儲存一筆面試記錄 */
export function saveHistory(resultData) {
    const record = {
        date: new Date().toISOString(),
        type: state.interviewType,
        mode: state.mode,
        questionCount: state.questions.length,
        overallRating: resultData.overallRating,
        verdict: resultData.verdict,
        qaHistory: state.qaHistory,
        summary: resultData.summary,
    };

    const history = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    history.unshift(record);
    if (history.length > MAX_RECORDS) history.length = MAX_RECORDS;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

/** 渲染歷史列表 */
export function renderHistory() {
    const history = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const list = $('historyList');
    const empty = $('historyEmpty');

    if (history.length === 0) {
        list.classList.add('hidden');
        empty.classList.remove('hidden');
        return;
    }

    empty.classList.add('hidden');
    list.classList.remove('hidden');

    const typeLabels = {
        mixed: '綜合面試',
        technical: '技術面試',
        behavioral: '行為面試',
        coding: 'Coding Test',
        design: 'System Design',
    };

    list.innerHTML = history
        .map(
            (h, i) => `
      <div class="history-item" data-index="${i}">
        <div class="history-item-info">
          <span class="history-item-date">${new Date(h.date).toLocaleString('zh-TW')}</span>
          <span class="history-item-type">${typeLabels[h.type] || h.type} · ${h.questionCount} 題 · ${h.verdict || ''}</span>
        </div>
        <span class="history-item-score">${h.overallRating}/10</span>
      </div>`
        )
        .join('');
}

// ── Event listeners ──────────────────────────────────────
$('btnHistory').addEventListener('click', () => {
    renderHistory();
    showView('history');
});

$('btnBackFromHistory').addEventListener('click', () => showView('upload'));
