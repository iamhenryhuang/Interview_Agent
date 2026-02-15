/**
 * src/gemini.js
 * Gemini API client — lazy init + JSON response helper
 */
const { GoogleGenAI } = require('@google/genai');

let client = null;

/**
 * 取得（或初始化）Gemini client
 * @returns {GoogleGenAI}
 */
function getClient() {
    if (!client) {
        const key = process.env.GEMINI_API_KEY;
        if (!key || key === 'your_api_key_here') {
            throw new Error('請在 .env 檔案中設定 GEMINI_API_KEY');
        }
        client = new GoogleGenAI({ apiKey: key });
    }
    return client;
}

/**
 * 呼叫 Gemini 並回傳 parsed JSON
 * @param {string} prompt
 * @returns {Promise<object>}
 */
async function callGemini(prompt) {
    const ai = getClient();

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' },
    });

    const text = response.text;

    try {
        return JSON.parse(text);
    } catch {
        const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (match) return JSON.parse(match[1].trim());
        throw new Error('無法解析 AI 回應為 JSON');
    }
}

module.exports = { callGemini };
