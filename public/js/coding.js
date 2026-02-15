/**
 * js/coding.js
 * Coding Test 流程
 */
import { state, $, views, showView, showLoading, hideLoading, animateNumber } from './main.js';
import { postJSON } from './api.js';
import { startTimer, stopTimer, getElapsed } from './timer.js';
import { finishSpecialized } from './result.js';

/** 開始 Coding Test */
export async function startCodingTest() {
    showLoading('正在載入 Coding 題目...');

    try {
        const data = await postJSON('/api/start-coding-test', {
            count: state.questionCount,
            difficulty: 'mixed',
        });

        state.mode = 'coding';
        state.questions = data.questions;
        state.currentIndex = 0;
        state.qaHistory = [];

        hideLoading();
        showView('coding');
        showCodingQuestion(0);
    } catch (err) {
        hideLoading();
        alert('Coding Test 載入失敗：' + err.message);
    }
}

// ── Show Coding Question ─────────────────────────────────
function showCodingQuestion(index) {
    const q = state.questions[index];

    // Progress
    $('codingProgressLabel').textContent = `第 ${index + 1} / ${state.questions.length} 題`;
    $('codingProgressCat').textContent = `${q.difficulty} · ${q.category}`;
    $('codingProgressFill').style.width = `${((index + 1) / state.questions.length) * 100}%`;

    // Problem content
    $('codingTitle').textContent = q.title;
    $('codingDifficulty').textContent = q.difficulty;
    $('codingDescription').textContent = q.description;

    // Examples
    const examplesEl = $('codingExamples');
    examplesEl.innerHTML = (q.examples || [])
        .map(
            (ex) => `<div class="coding-example-item">
        <strong>Input:</strong> ${ex.input}<br>
        <strong>Output:</strong> ${ex.output}
        ${ex.explanation ? `<br><strong>Explanation:</strong> ${ex.explanation}` : ''}
      </div>`
        )
        .join('');

    // Constraints
    const constraintsEl = $('codingConstraints');
    constraintsEl.innerHTML = q.constraints
        ? `<strong>Constraints</strong><br>${q.constraints.join('<br>')}`
        : '';

    // Reset editor
    $('codeInput').value = '';
    $('codeInput').disabled = false;
    $('codeLineCount').textContent = '0 行';
    $('langSelect').value = 'javascript';
    $('btnSubmitCode').disabled = false;
    $('codingFeedbackCard').classList.add('hidden');
    $('btnNextCoding').classList.add('hidden');

    startTimer('codingTimer');
}

// ── Code Input ───────────────────────────────────────────
$('codeInput').addEventListener('input', () => {
    $('codeLineCount').textContent = `${$('codeInput').value.split('\n').length} 行`;
});

// ── Submit Code ──────────────────────────────────────────
$('btnSubmitCode').addEventListener('click', submitCode);

async function submitCode() {
    const code = $('codeInput').value.trim();
    if (!code) return alert('請先輸入你的程式碼');

    stopTimer();
    $('codeInput').disabled = true;
    $('btnSubmitCode').disabled = true;

    $('codingFeedbackCard').classList.remove('hidden');
    $('codingFeedbackScore').textContent = '...';
    $('codingFeedbackText').textContent = '正在評估你的程式碼...';
    setCodingDimensions(0, 0, 0, 0, 0);

    const q = state.questions[state.currentIndex];

    try {
        const data = await postJSON('/api/evaluate-code', {
            problem: q,
            code,
            language: $('langSelect').value,
        });

        state.qaHistory.push({
            ...q,
            answer: code,
            language: $('langSelect').value,
            answerTime: getElapsed(),
            overallScore: data.overallScore,
            scores: data.scores,
            feedback: data.feedback,
            strengths: data.strengths,
            improvements: data.improvements,
        });

        displayCodingFeedback(data);
    } catch (err) {
        $('codingFeedbackText').textContent = '評分失敗：' + err.message;
    }
}

// ── Display Coding Feedback ──────────────────────────────
function displayCodingFeedback(data) {
    animateNumber($('codingFeedbackScore'), data.overallScore, 1);

    const s = data.scores || {};
    setTimeout(() => setCodingDimensions(s.correctness, s.timeComplexity, s.spaceComplexity, s.codeQuality, s.edgeCases), 200);

    // Complexity info
    $('timeComplexityValue').textContent = data.timeComplexity || '—';
    $('spaceComplexityValue').textContent = data.spaceComplexity || '—';

    $('codingFeedbackText').textContent = data.feedback || '';

    // Strengths / improvements
    renderList($('codingStrengths'), '✓ 優點', data.strengths, 'feedback-strengths');
    renderList($('codingImprovements'), '→ 改善方向', data.improvements, 'feedback-improvements');

    // Next button
    const isLast = state.currentIndex >= state.questions.length - 1;
    $('btnNextCoding').textContent = isLast ? '完成測試，查看結果 →' : '下一題 →';
    $('btnNextCoding').classList.remove('hidden');
}

function setCodingDimensions(cor = 0, tc = 0, sc = 0, cq = 0, ec = 0) {
    const dims = [
        ['dimCorrectness', 'dimCorrectnessVal', cor],
        ['dimTimeComp', 'dimTimeCompVal', tc],
        ['dimSpaceComp', 'dimSpaceCompVal', sc],
        ['dimCodeQuality', 'dimCodeQualityVal', cq],
        ['dimEdgeCases', 'dimEdgeCasesVal', ec],
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
$('btnNextCoding').addEventListener('click', () => {
    state.currentIndex++;
    if (state.currentIndex >= state.questions.length) {
        finishSpecialized('coding');
    } else {
        showCodingQuestion(state.currentIndex);
        views.coding.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
});
