/**
 * js/api.js
 * fetch 封裝 — 統一的 POST JSON helper
 */

/**
 * POST JSON 到指定路徑，回傳 parsed response
 * @param {string} path  e.g. '/api/start-interview'
 * @param {object} body
 * @returns {Promise<object>}
 */
export async function postJSON(path, body) {
    const res = await fetch(path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
    return data;
}
