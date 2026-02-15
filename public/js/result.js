/**
 * js/result.js
 * 結果頁面 — 展示面試報告 + 雷達圖 + 逐題回顧
 */
import { state, $, showView, showLoading, hideLoading, animateNumber } from './main.js';
import { postJSON } from './api.js';
import { stopTimer } from './timer.js';
import { drawScoreCircle, drawRadarChart } from './canvas.js';
import { saveHistory } from './history.js';

// ── Display Result ───────────────────────────────────────
export function displayResult(data) {
    // Score circle
    drawScoreCircle('scoreCanvas', data.overallRating || 0);
    animateNumber($('resultScore'), data.overallRating || 0, 1);

    // Verdict
    const verdict = $('resultVerdict');
    verdict.textContent = data.verdict || '';
    if (data.verdict === '推薦錄取') verdict.className = 'result-verdict positive';
    else if (data.verdict === '不推薦') verdict.className = 'result-verdict negative';
    else verdict.className = 'result-verdict neutral';

    // Summary
    $('resultSummary').textContent = data.summary || '';

    // Radar chart
    if (data.dimensionScores) {
        drawRadarChart('radarCanvas', data.dimensionScores);
    }

    // Strengths
    $('resultStrengths').innerHTML = (data.topStrengths || [])
        .map((s) => `<li>${s}</li>`)
        .join('');

    // Improvements
    $('resultImprovements').innerHTML = (data.areasToImprove || [])
        .map((s) => `<li>${s}</li>`)
        .join('');

    // Breakdown
    $('resultBreakdown').innerHTML = state.qaHistory
        .map(
            (qa, i) => `
      <div class="breakdown-item">
        <div class="breakdown-header">
          <span class="breakdown-q">Q${i + 1}. ${qa.question || qa.title}</span>
          <span class="breakdown-score">${qa.overallScore}/10</span>
        </div>
        <div class="breakdown-answer">${truncate(qa.answer, 200)}</div>
      </div>`
        )
        .join('');

    // Notes & next steps
    $('resultNotes').textContent = data.interviewerNotes || '';
    $('resultNextSteps').textContent = data.suggestedNextSteps || '';
}

/** Fallback when summary API fails */
export function displayResultFallback() {
    const avgScore =
        state.qaHistory.reduce((sum, qa) => sum + (qa.overallScore || 0), 0) /
        (state.qaHistory.length || 1);

    displayResult({
        overallRating: parseFloat(avgScore.toFixed(1)),
        verdict: avgScore >= 7 ? '推薦錄取' : avgScore >= 5 ? '有條件推薦' : '建議再觀察',
        summary: '面試報告生成過程中發生錯誤，以下為基於個別題目評分的摘要。',
        topStrengths: [],
        areasToImprove: [],
        interviewerNotes: '',
        suggestedNextSteps: '建議重新進行一次模擬面試以獲取完整報告。',
    });
}

/** Shared feedback list renderer */
export function renderFeedbackList(container, title, items, className) {
    if (items?.length) {
        container.innerHTML = `<h4>${title}</h4><ul>${items.map((s) => `<li>${s}</li>`).join('')}</ul>`;
        container.className = 'feedback-list ' + className;
    } else {
        container.innerHTML = '';
    }
}

/** Shared finish handler for coding / design modes */
export async function finishSpecialized(mode) {
    stopTimer();
    showLoading('正在撰寫面試報告...');

    try {
        const data = await postJSON('/api/specialized-summary', {
            qaHistory: state.qaHistory,
            mode,
        });

        hideLoading();
        displayResult(data);
        saveHistory(data);
        showView('result');
    } catch (err) {
        hideLoading();
        alert('生成面試報告失敗：' + err.message);
        displayResultFallback();
        showView('result');
    }
}

function truncate(str, len) {
    if (!str) return '';
    return str.length > len ? str.slice(0, len) + '...' : str;
}
