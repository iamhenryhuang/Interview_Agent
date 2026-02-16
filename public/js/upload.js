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

        // Show/hide coding source selector
        const isCoding = btn.dataset.type === 'coding';
        $('codingSourceSection').classList.toggle('hidden', !isCoding);
        if (!isCoding) {
            $('leetcodeOptions').classList.add('hidden');
            state.codingSource = 'local';
        }
    });
});

document.querySelectorAll('.count-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.count-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        state.questionCount = parseInt(btn.dataset.count);
    });
});

// ── Coding Source Selector ───────────────────────────────

document.querySelectorAll('.source-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.source-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        state.codingSource = btn.dataset.source;

        const isLC = btn.dataset.source === 'leetcode';
        $('leetcodeOptions').classList.toggle('hidden', !isLC);

        // 首次選 LeetCode 時，載入 tag selector
        if (isLC && !$('lcTagSelector').children.length) {
            loadTagSelector();
        }
    });
});

// ── LeetCode Difficulty Selector ─────────────────────────
document.querySelectorAll('.lc-diff-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.lc-diff-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        state.lcDifficulty = btn.dataset.lcdiff;
    });
});

// ── Tag Selector ─────────────────────────────────────────
async function loadTagSelector() {
    const container = $('lcTagSelector');
    try {
        const res = await fetch('/api/leetcode/tags');
        const data = await res.json();
        const tags = data.tags || [];

        container.innerHTML = tags
            .map(
                (t) =>
                    `<button class="tag-btn" data-tag="${t.slug}">${t.name}</button>`
            )
            .join('');

        container.querySelectorAll('.tag-btn').forEach((btn) => {
            btn.addEventListener('click', () => {
                btn.classList.toggle('active');
                state.lcTags = Array.from(container.querySelectorAll('.tag-btn.active')).map(
                    (b) => b.dataset.tag
                );
            });
        });
    } catch {
        container.innerHTML = '<span style="color:var(--text-secondary)">無法載入標籤</span>';
    }
}

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

        if (state.resumeText.length < 150) {
            const confirm = window.confirm(`履歷內容似乎過短（僅 ${state.resumeText.length} 字），可能導致系統無法生成精確的客製化題目。\n\n確定要繼續嗎？`);
            if (!confirm) return;
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
    showView('upload');
});

// ── Home Button (Logo) ───────────────────────────────────
$('btnHome').addEventListener('click', () => {
    // 如果正在面試中，可能需要確認？這裡直接重置
    resetUpload();
    state.interviewType = 'mixed';

    // Reset active states
    document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('.type-btn[data-type="mixed"]').classList.add('active');

    // Reset views
    showView('viewUpload');

    // Reset active view class manually since showView takes ID but state.currentView stores ID... 
    // Wait, showView takes ID name? 
    // view 'upload' -> ID 'viewUpload'. showView('upload') works.
    showView('upload');
});
