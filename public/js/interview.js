/**
 * js/interview.js
 * 傳統面試流程 — 出題、回答、feedback、結束
 */
import { state, $, views, showView, showLoading, hideLoading, animateNumber } from './main.js';
import { postJSON } from './api.js';
import { startTimer, stopTimer, getElapsed } from './timer.js';
import { displayResult, displayResultFallback, renderFeedbackList } from './result.js';
import { saveHistory } from './history.js';

/** 開始傳統面試 */
export async function startInterviewFlow() {
    showLoading('正在根據你的履歷出題...');

    try {
        const data = await postJSON('/api/start-interview', {
            resumeText: state.resumeText,
            interviewType: state.interviewType,
            questionCount: state.questionCount,
        });

        state.mode = 'interview';
        state.questions = data.questions;
        state.currentIndex = 0;
        state.qaHistory = [];

        hideLoading();
        showView('interview');
        showQuestion(0);
    } catch (err) {
        hideLoading();
        alert('面試題目生成失敗：' + err.message);
    }
}

// ── Show Question ────────────────────────────────────────
function showQuestion(index) {
    const q = state.questions[index];

    // Progress
    $('progressLabel').textContent = `第 ${index + 1} / ${state.questions.length} 題`;
    $('progressCat').textContent = q.category || '';
    $('progressFill').style.width = `${((index + 1) / state.questions.length) * 100}%`;

    // Question content
    $('questionText').textContent = q.question;

    // Context (resume section)
    if (q.relatedResumeSection) {
        $('questionContext').classList.remove('hidden');
        $('contextText').textContent = q.relatedResumeSection;
    } else {
        $('questionContext').classList.add('hidden');
    }

    // Reset answer area
    $('answerInput').value = '';
    $('answerInput').disabled = false;
    $('charCount').textContent = '0 字';
    $('btnSubmitAnswer').disabled = false;
    $('feedbackCard').classList.add('hidden');
    $('followUpSection').classList.add('hidden');
    $('btnNextQuestion').classList.add('hidden');

    // Start timer
    startTimer('questionTimer');
}

// ── Character Count ──────────────────────────────────────
$('answerInput').addEventListener('input', () => {
    $('charCount').textContent = `${$('answerInput').value.length} 字`;
});

// ── Submit Answer ────────────────────────────────────────
$('btnSubmitAnswer').addEventListener('click', submitAnswer);

async function submitAnswer() {
    const answer = $('answerInput').value.trim();
    if (!answer) return alert('請先輸入你的回答');

    stopTimer();
    $('answerInput').disabled = true;
    $('btnSubmitAnswer').disabled = true;

    const q = state.questions[state.currentIndex];

    // Show loading inline
    $('feedbackCard').classList.remove('hidden');
    $('feedbackScore').textContent = '...';
    $('feedbackText').textContent = '正在評估你的回答...';
    setDimensions(0, 0, 0, 0);

    try {
        const data = await postJSON('/api/evaluate-answer', {
            question: q.question,
            answer,
            resumeContext: q.relatedResumeSection || '',
            keyPoints: q.keyPoints || [],
        });

        // Save to history
        state.qaHistory.push({
            ...q,
            answer,
            answerTime: getElapsed(),
            overallScore: data.overallScore,
            scores: data.scores,
            feedback: data.feedback,
            strengths: data.strengths,
            improvements: data.improvements,
            followUp: data.followUp,
        });

        displayFeedback(data);
    } catch (err) {
        $('feedbackText').textContent = '評分失敗：' + err.message;
    }
}

// ── Display Feedback ─────────────────────────────────────
function displayFeedback(data) {
    animateNumber($('feedbackScore'), data.overallScore, 1);

    const s = data.scores || {};
    setTimeout(() => setDimensions(s.relevance || 0, s.depth || 0, s.communication || 0, s.specificity || 0), 200);

    $('feedbackText').textContent = data.feedback || '';

    renderFeedbackList($('feedbackStrengths'), '✓ 優點', data.strengths, 'feedback-strengths');
    renderFeedbackList($('feedbackImprovements'), '→ 改善方向', data.improvements, 'feedback-improvements');

    // Follow-up
    const fuSection = $('followUpSection');
    if (data.followUp && data.followUp !== 'null' && data.followUp !== null) {
        fuSection.classList.remove('hidden');
        $('followUpText').textContent = data.followUp;
        $('followUpInput').value = '';
    } else {
        fuSection.classList.add('hidden');
    }

    // Next button
    const isLast = state.currentIndex >= state.questions.length - 1;
    $('btnNextQuestion').textContent = isLast ? '完成面試，查看結果 →' : '下一題 →';
    $('btnNextQuestion').classList.remove('hidden');
}

function setDimensions(rel, dep, comm, spec) {
    $('dimRelevance').style.width = `${rel * 10}%`;
    $('dimRelevanceVal').textContent = rel;
    $('dimDepth').style.width = `${dep * 10}%`;
    $('dimDepthVal').textContent = dep;
    $('dimComm').style.width = `${comm * 10}%`;
    $('dimCommVal').textContent = comm;
    $('dimSpec').style.width = `${spec * 10}%`;
    $('dimSpecVal').textContent = spec;
}

// ── Follow-Up ────────────────────────────────────────────
$('btnSubmitFollowUp').addEventListener('click', async () => {
    const answer = $('followUpInput').value.trim();
    if (!answer) return;

    $('btnSubmitFollowUp').disabled = true;
    $('followUpInput').disabled = true;

    const lastQA = state.qaHistory[state.qaHistory.length - 1];
    if (lastQA) lastQA.followUpAnswer = answer;

    $('btnSubmitFollowUp').textContent = '✓ 已記錄';
    setTimeout(() => {
        $('btnSubmitFollowUp').disabled = false;
        $('followUpInput').disabled = false;
        $('btnSubmitFollowUp').textContent = '提交追問回答';
    }, 1200);
});

// ── Next / Finish ────────────────────────────────────────
$('btnNextQuestion').addEventListener('click', () => {
    state.currentIndex++;
    if (state.currentIndex >= state.questions.length) {
        finishInterview();
    } else {
        showQuestion(state.currentIndex);
        views.interview.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
});

async function finishInterview() {
    stopTimer();
    showLoading('正在撰寫面試報告...');

    try {
        const data = await postJSON('/api/interview-summary', {
            qaHistory: state.qaHistory,
            resumeText: state.resumeText,
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
