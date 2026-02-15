/**
 * js/timer.js
 * 面試計時器 — start / stop / format
 */

let interval = null;
let seconds = 0;
let displayEl = null;

/** 開始計時，指定顯示元素的 id */
export function startTimer(elementId) {
    stopTimer();
    seconds = 0;
    displayEl = document.getElementById(elementId);
    updateDisplay();

    interval = setInterval(() => {
        seconds++;
        updateDisplay();
    }, 1000);
}

/** 停止計時 */
export function stopTimer() {
    if (interval) {
        clearInterval(interval);
        interval = null;
    }
}

/** 取得已經過的秒數 */
export function getElapsed() {
    return seconds;
}

function updateDisplay() {
    if (!displayEl) return;
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    displayEl.textContent = `${m}:${s}`;
}
