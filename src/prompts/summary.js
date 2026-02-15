/**
 * src/prompts/summary.js
 * 面試結束總結報告 prompt
 */

const REPORT_SCHEMA = `{
  "overallRating": 7.5,
  "verdict": "推薦錄取" | "有條件推薦" | "建議再觀察" | "不推薦",
  "summary": "2-3 句話的整體評價",
  "dimensionScores": {
    "technicalSkill": 8,
    "problemSolving": 7,
    "communication": 8,
    "cultureFit": 7,
    "potential": 8
  },
  "topStrengths": ["核心優勢1", "核心優勢2", "核心優勢3"],
  "areasToImprove": ["待加強1", "待加強2"],
  "interviewerNotes": "面試官私人備註",
  "suggestedNextSteps": "建議下一步"
}`;

/**
 * 傳統面試總結報告
 */
function buildSummaryPrompt(qaHistory, resumeText) {
    const qaStr = qaHistory
        .map(
            (qa, i) => `
【第 ${i + 1} 題】(${qa.category})
題目：${qa.question}
回答：${qa.answer}
得分：${qa.overallScore}/10`
        )
        .join('\n---\n');

    return `你是一位資深面試官，剛完成一場面試，需要撰寫總結報告。

【候選人履歷摘要】
${resumeText.substring(0, 1500)}

【面試問答記錄】
${qaStr}

請撰寫一份完整的面試報告，以下列 JSON 格式回應：
${REPORT_SCHEMA}`;
}

/**
 * Coding / System Design 總結報告
 */
function buildSpecializedSummaryPrompt(qaHistory, mode) {
    const modeLabel = mode === 'coding' ? 'Coding Test' : 'System Design';

    const qaStr = qaHistory
        .map(
            (qa, i) => `
【第 ${i + 1} 題】${qa.title || qa.question}
回答摘要：${(qa.answer || '').substring(0, 300)}
得分：${qa.overallScore}/10`
        )
        .join('\n---\n');

    return `你是一位資深${modeLabel}面試官，剛完成面試，需要撰寫總結報告。

【面試問答記錄】
${qaStr}

以下列 JSON 格式回應：
${REPORT_SCHEMA}`;
}

module.exports = { buildSummaryPrompt, buildSpecializedSummaryPrompt };
