/**
 * js/coding.js
 * Coding Test 流程 — 支援本地題庫 + LeetCode 即時爬題
 */
import { state, $, views, showView, showLoading, hideLoading, animateNumber } from './main.js';
import { postJSON } from './api.js';
import { startTimer, stopTimer, getElapsed } from './timer.js';
import { finishSpecialized } from './result.js';

/** 開始 Coding Test */
export async function startCodingTest() {
    const source = state.codingSource || 'local';

    if (source === 'leetcode') {
        await startCodingTestLeetCode();
    } else {
        await startCodingTestLocal();
    }
}

/** 本地題庫 */
async function startCodingTestLocal() {
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

/** LeetCode 即時爬題 */
async function startCodingTestLeetCode() {
    showLoading('正在從 LeetCode 爬取題目（需要數秒）...');

    try {
        const data = await postJSON('/api/start-coding-test-leetcode', {
            count: state.questionCount,
            difficulty: state.lcDifficulty || 'mixed',
            tags: state.lcTags || [],
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
        alert('LeetCode 取題失敗：' + err.message);
    }
}

// ── Show Coding Question ─────────────────────────────────
function showCodingQuestion(index) {
    const q = state.questions[index];

    // Progress
    $('codingProgressLabel').textContent = `第 ${index + 1} / ${state.questions.length} 題`;
    $('codingProgressCat').textContent = `${q.difficulty} · ${q.category || q.tags?.[0] || 'coding'}`;
    $('codingProgressFill').style.width = `${((index + 1) / state.questions.length) * 100}%`;

    // Problem content — 支援 LeetCode 題目
    const isLC = q.source === 'leetcode';
    const titlePrefix = isLC ? `[LC #${q.id}] ` : '';
    $('codingTitle').textContent = titlePrefix + q.title;
    $('codingDifficulty').textContent = q.difficulty;
    $('codingDifficulty').className = `q-difficulty difficulty-${q.difficulty}`;

    // Description（LeetCode 題目使用原始 HTML 渲染）
    const descEl = $('codingDescription');
    const examplesEl = $('codingExamples');
    const constraintsEl = $('codingConstraints');

    if (isLC && q.descriptionHtml) {
        // LeetCode: 原始 HTML 已包含 examples + constraints，直接渲染
        descEl.innerHTML = q.descriptionHtml;
        examplesEl.innerHTML = '';
        constraintsEl.innerHTML = '';
    } else {
        // 本地題目：分區渲染
        descEl.textContent = q.description || '';

        // Examples
        examplesEl.innerHTML = (q.examples || [])
            .map(
                (ex, i) => `<div class="coding-example-item">
            <strong>Example ${i + 1}:</strong><br>
            <strong>Input:</strong> ${ex.input}<br>
            <strong>Output:</strong> ${ex.output}
            ${ex.explanation ? `<br><strong>Explanation:</strong> ${ex.explanation}` : ''}
          </div>`
            )
            .join('');

        // Constraints
        constraintsEl.innerHTML = q.constraints?.length
            ? `<strong>Constraints</strong><br>${q.constraints.join('<br>')}`
            : '';
    }

    // LeetCode link
    let lcLinkEl = $('leetcodeLink');
    if (!lcLinkEl) {
        lcLinkEl = document.createElement('a');
        lcLinkEl.id = 'leetcodeLink';
        lcLinkEl.className = 'leetcode-link';
        lcLinkEl.target = '_blank';
        lcLinkEl.rel = 'noopener noreferrer';
        $('codingConstraints').parentElement.appendChild(lcLinkEl);
    }
    if (isLC && q.leetcodeUrl) {
        lcLinkEl.href = q.leetcodeUrl;
        lcLinkEl.textContent = '🔗 在 LeetCode 上查看';
        lcLinkEl.classList.remove('hidden');
    } else {
        lcLinkEl.classList.add('hidden');
    }

    // Reset editor & pre-fill code snippet
    const lang = isLC ? 'python' : 'javascript';
    $('codingLanguage').value = lang;
    $('codeInput').disabled = false;
    $('btnSubmitCode').disabled = false;
    $('codeFeedbackCard').classList.add('hidden');
    $('btnNextCoding').classList.add('hidden');

    // 預填 LeetCode 函式模板
    fillCodeSnippet(q, lang);

    startTimer('codingTimerDisplay');
}

// ── 語言對應表（前端 select value → LeetCode langSlug）───
const LANG_MAP = {
    python: 'python3',
    javascript: 'javascript',
    java: 'java',
    cpp: 'cpp',
    c: 'c',
};

// ── 預填 code snippet ────────────────────────────────────
function fillCodeSnippet(q, lang) {
    if (q.source === 'leetcode' && q.codeSnippets) {
        const lcLang = LANG_MAP[lang] || lang;
        const snippet = q.codeSnippets[lcLang] || '';
        $('codeInput').value = snippet;
    } else {
        $('codeInput').value = '';
    }
    $('codeLineCount').textContent = `${$('codeInput').value.split('\n').length} 行`;
}

// ── 切換語言時更新 code snippet ──────────────────────────
$('codingLanguage').addEventListener('change', () => {
    const q = state.questions[state.currentIndex];
    if (q) fillCodeSnippet(q, $('codingLanguage').value);
});

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

    $('codeFeedbackCard').classList.remove('hidden');
    $('codeFeedbackScore').textContent = '...';
    $('codeFeedbackText').textContent = '正在評估你的程式碼...';
    setCodingDimensions(0, 0, 0, 0, 0);

    const q = state.questions[state.currentIndex];

    try {
        const data = await postJSON('/api/evaluate-code', {
            problem: q,
            code,
            language: $('codingLanguage').value,
        });

        state.qaHistory.push({
            ...q,
            answer: code,
            language: $('codingLanguage').value,
            answerTime: getElapsed(),
            overallScore: data.overallScore,
            scores: data.scores,
            feedback: data.feedback,
            strengths: data.strengths,
            improvements: data.improvements,
        });

        displayCodingFeedback(data);
    } catch (err) {
        $('codeFeedbackText').textContent = '評分失敗：' + err.message;
    }
}

// ── Display Coding Feedback ──────────────────────────────
function displayCodingFeedback(data) {
    animateNumber($('codeFeedbackScore'), data.overallScore, 1);

    const s = data.scores || {};
    setTimeout(() => setCodingDimensions(s.correctness, s.timeComplexity, s.spaceComplexity, s.codeQuality, s.edgeCases), 200);

    // Complexity info
    const complexEl = $('codeComplexityInfo');
    if (complexEl) {
        complexEl.innerHTML = `
            <span><strong>時間:</strong> ${data.timeComplexity || '—'}</span>
            <span><strong>空間:</strong> ${data.spaceComplexity || '—'}</span>
        `;
    }

    $('codeFeedbackText').textContent = data.feedback || '';

    // Strengths / improvements
    renderList($('codeFeedbackStrengths'), '✓ 優點', data.strengths, 'feedback-strengths');
    renderList($('codeFeedbackImprovements'), '→ 改善方向', data.improvements, 'feedback-improvements');

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
