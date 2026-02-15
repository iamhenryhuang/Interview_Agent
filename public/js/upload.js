/**
 * js/upload.js
 * 檔案上傳 + 面試設定 + 開始面試
 */
import { state, $, showView, showLoading, hideLoading } from './main.js';
import { startCodingTest } from './coding.js';
import { startDesignInterview } from './design.js';
import { startInterviewFlow } from './interview.js';

// ── DOM refs ─────────────────────────────────────────────
const dropZone = $('dropZone');
const fileInput = $('fileInput');
const fileInfo = $('fileInfo');
const configSection = $('configSection');

// ── Drag & Drop ──────────────────────────────────────────
dropZone.addEventListener('click', () => fileInput.click());

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
});

dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file?.type === 'application/pdf') handleFile(file);
});

fileInput.addEventListener('change', () => {
    if (fileInput.files[0]) handleFile(fileInput.files[0]);
});

$('btnRemoveFile').addEventListener('click', (e) => {
    e.stopPropagation();
    resetUpload();
});

// ── File handling ────────────────────────────────────────
export function resetUpload() {
    state.resumeText = '';
    fileInput.value = '';
    fileInfo.classList.add('hidden');
    configSection.classList.add('hidden');
    $('resumeHint').classList.add('hidden');
}

async function handleFile(file) {
    showLoading('正在解析履歷...');

    try {
        const formData = new FormData();
        formData.append('resume', file);

        const res = await fetch('/api/upload-resume', { method: 'POST', body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        state.resumeText = data.resumeText;

        // Update UI
        $('fileName').textContent = file.name;
        $('fileStats').textContent = `${data.pageCount} 頁 · ${data.charCount} 字元`;
        fileInfo.classList.remove('hidden');
        configSection.classList.remove('hidden');

        hideLoading();
    } catch (err) {
        hideLoading();
        alert('履歷解析失敗：' + err.message);
    }
}

// ── Interview Config ─────────────────────────────────────
document.querySelectorAll('.type-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.type-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        state.interviewType = btn.dataset.type;

        // Toggle resume hint for modes that don't need resume
        const needsResume = !['coding', 'design'].includes(btn.dataset.type);
        $('resumeHint').classList.toggle('hidden', needsResume);
    });
});

document.querySelectorAll('.count-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.count-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        state.questionCount = parseInt(btn.dataset.count);
    });
});

// ── Start Interview ──────────────────────────────────────
$('btnStartInterview').addEventListener('click', () => {
    const type = state.interviewType;

    if (type === 'coding') {
        startCodingTest();
    } else if (type === 'design') {
        startDesignInterview();
    } else {
        if (!state.resumeText) {
            alert('請先上傳履歷 PDF');
            return;
        }
        startInterviewFlow();
    }
});

// ── New Interview ────────────────────────────────────────
$('btnNewInterview').addEventListener('click', () => {
    resetUpload();
    configSection.classList.add('hidden');
    $('resumeHint').classList.add('hidden');
    showView('upload');
});
