/**
 * js/design.js
 * System Design 面試流程
 */
import { state, $, views, showView, showLoading, hideLoading, animateNumber } from './main.js';
import { postJSON } from './api.js';
import { startTimer, stopTimer, getElapsed } from './timer.js';
import { finishSpecialized } from './result.js';

/** 開始 System Design 面試 */
export async function startDesignInterview() {
    showLoading('正在載入設計題目...');

    try {
        const data = await postJSON('/api/start-system-design', {
            count: state.questionCount,
            difficulty: 'mixed',
        });

        state.mode = 'design';
        state.questions = data.questions;
        state.currentIndex = 0;
        state.qaHistory = [];

        hideLoading();
        showView('design');
        showDesignQuestion(0);
    } catch (err) {
        hideLoading();
        alert('System Design 載入失敗：' + err.message);
    }
}

// ── Show Design Question ─────────────────────────────────
function showDesignQuestion(index) {
    const q = state.questions[index];

    // Progress
    $('designProgressLabel').textContent = `第 ${index + 1} / ${state.questions.length} 題`;
    $('designProgressCat').textContent = `${q.difficulty} · ${q.category || 'design'}`;
    $('designProgressFill').style.width = `${((index + 1) / state.questions.length) * 100}%`;

    // Problem content
    $('designTitle').textContent = q.title;
    $('designDifficulty').textContent = q.difficulty;
    $('designDescription').textContent = q.description;

    // Requirements
    const reqEl = $('designRequirements');
    if (q.requirements?.length) {
        reqEl.innerHTML =
            '<strong>Requirements</strong><ul>' +
            q.requirements.map((r) => `<li>${r}</li>`).join('') +
            '</ul>';
    } else {
        reqEl.innerHTML = '';
    }

    // Reset answer area
    $('designInput').value = '';
    $('designInput').disabled = false;
    $('designCharCount').textContent = '0 字';
    $('btnSubmitDesign').disabled = false;
    $('designFeedbackCard').classList.add('hidden');
    $('btnNextDesign').classList.add('hidden');

    startTimer('designTimer');
}

// ── Character Count ──────────────────────────────────────
$('designInput').addEventListener('input', () => {
    $('designCharCount').textContent = `${$('designInput').value.length} 字`;
});

// ── Submit Design ────────────────────────────────────────
$('btnSubmitDesign').addEventListener('click', submitDesign);

async function submitDesign() {
    const answer = $('designInput').value.trim();
    if (!answer) return alert('請先輸入你的設計方案');

    stopTimer();
    $('designInput').disabled = true;
    $('btnSubmitDesign').disabled = true;

    $('designFeedbackCard').classList.remove('hidden');
    $('designFeedbackScore').textContent = '...';
    $('designFeedbackText').textContent = '正在評估你的設計...';
    setDesignDimensions(0, 0, 0, 0, 0);

    const q = state.questions[state.currentIndex];

    try {
        const data = await postJSON('/api/evaluate-design', { problem: q, answer });

        state.qaHistory.push({
            ...q,
            answer,
            answerTime: getElapsed(),
            overallScore: data.overallScore,
            scores: data.scores,
            feedback: data.feedback,
            strengths: data.strengths,
            improvements: data.improvements,
        });

        displayDesignFeedback(data);
    } catch (err) {
        $('designFeedbackText').textContent = '評分失敗：' + err.message;
    }
}

// ── Display Design Feedback ──────────────────────────────
function displayDesignFeedback(data) {
    animateNumber($('designFeedbackScore'), data.overallScore, 1);

    const s = data.scores || {};
    setTimeout(() => setDesignDimensions(s.apiDesign, s.dataModel, s.scalability, s.tradeoffs, s.communication), 200);

    $('designFeedbackText').textContent = data.feedback || '';

    renderList($('designStrengths'), '✓ 優點', data.strengths, 'feedback-strengths');
    renderList($('designImprovements'), '→ 改善方向', data.improvements, 'feedback-improvements');

    // Follow-up
    if (data.followUp && data.followUp !== 'null') {
        $('designFollowUp').classList.remove('hidden');
        $('designFollowUpText').textContent = data.followUp;
    } else {
        $('designFollowUp').classList.add('hidden');
    }

    // Next button
    const isLast = state.currentIndex >= state.questions.length - 1;
    $('btnNextDesign').textContent = isLast ? '完成面試，查看結果 →' : '下一題 →';
    $('btnNextDesign').classList.remove('hidden');
}

function setDesignDimensions(api = 0, dm = 0, sc = 0, tr = 0, co = 0) {
    const dims = [
        ['dimApiDesign', 'dimApiDesignVal', api],
        ['dimDataModel', 'dimDataModelVal', dm],
        ['dimScalability', 'dimScalabilityVal', sc],
        ['dimTradeoffs', 'dimTradeoffsVal', tr],
        ['dimDesignComm', 'dimDesignCommVal', co],
    ];
    for (const [barId, valId, val] of dims) {
        $(barId).style.width = `${(val || 0) * 10}%`;
        $(valId).textContent = val || 0;
    }
}

function renderList(container, title, items, className) {
    if (items?.length) {
        container.innerHTML = `<h4>${title}</h4><ul>${items.map((s) => `<li>${s}</li>`).join('')}</ul>`;
        container.className = 'feedback-list ' + className;
    } else {
        container.innerHTML = '';
    }
}

// ── Next / Finish ────────────────────────────────────────
$('btnNextDesign').addEventListener('click', () => {
    state.currentIndex++;
    if (state.currentIndex >= state.questions.length) {
        finishSpecialized('design');
    } else {
        showDesignQuestion(state.currentIndex);
        views.design.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
});
