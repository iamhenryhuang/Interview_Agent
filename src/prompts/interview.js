/**
 * src/prompts/interview.js
 * 傳統面試 — 出題 & 評估 prompt
 */

/**
 * 根據履歷生成面試題目
 */
function buildQuestionPrompt(resumeText, interviewType, questionCount) {
  const typeMap = {
    technical: '技術面試（聚焦於專業技能、專案經驗、技術深度）',
    behavioral: '行為面試（聚焦於團隊合作、領導力、問題解決、情境反應）',
    mixed: '綜合面試（技術題與行為題各半）',
  };

  const typeDesc = typeMap[interviewType] || typeMap.mixed;

  return `你是一位經驗豐富的面試官，正在進行一場 ${typeDesc}。

以下是候選人的履歷：
---
${resumeText}
---

請根據這份履歷，生成 ${questionCount} 道面試題目。

**重要規則（CRITICAL）：**
1. **題目必須針對履歷中提到的具體經歷、技術堆疊、專案名稱或公司背景。**
2. **嚴禁生成與履歷無關的通用罐頭題**（除非履歷內容極少）。
3. 如果履歷中提到某個專案，請追問該專案的具體實作細節或挑戰。
4. 難度由淺入深排列。
5. 包含至少 1 題情境式問題（例如「如果遇到……你會怎麼處理？」）。
6. 每題附帶評分標準（滿分 10 分）。

請以下列 JSON 格式回應，不要加任何多餘文字：
{
  "questions": [
    {
      "id": 1,
      "category": "technical" | "behavioral" | "situational",
      "question": "題目內容（包含引用履歷中的具體內容）",
      "keyPoints": ["評分重點1", "評分重點2", "評分重點3"],
      "difficulty": "easy" | "medium" | "hard",
      "relatedResumeSection": "與此題相關的履歷段落摘要"
    }
  ]
}`;
}

/**
 * 評估單題回答
 */
function buildEvaluationPrompt(question, answer, resumeContext, keyPoints) {
  return `你是一位經驗豐富的面試官，正在評估候選人的回答。

【面試題目】
${question}

【評分重點】
${keyPoints.map((k, i) => `${i + 1}. ${k}`).join('\n')}

【候選人履歷背景】
${resumeContext}

【候選人的回答】
${answer}

請根據以下維度評分（每項 1-10 分）並提供具體回饋：

1. **相關性** (relevance)：回答是否切中問題核心
2. **深度** (depth)：是否展現足夠的專業深度
3. **表達力** (communication)：表達是否清晰有條理
4. **具體性** (specificity)：是否有具體的例子或數據佐證

另外請：
- 提供一個整體建議
- 如果回答不夠完整，生成一個追問問題來引導候選人補充

請以下列 JSON 格式回應，不要加任何多餘文字：
{
  "scores": {
    "relevance": 8,
    "depth": 7,
    "communication": 8,
    "specificity": 6
  },
  "overallScore": 7.3,
  "feedback": "整體評語",
  "strengths": ["優點1", "優點2"],
  "improvements": ["改善建議1", "改善建議2"],
  "followUp": "追問問題（如果不需要則為 null）"
}`;
}

module.exports = { buildQuestionPrompt, buildEvaluationPrompt };
