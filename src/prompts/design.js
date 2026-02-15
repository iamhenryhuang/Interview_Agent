/**
 * src/prompts/design.js
 * System Design 設計方案評估 prompt
 */

/**
 * 評估候選人的系統設計方案（精簡版，節省 token）
 */
function buildDesignEvaluationPrompt(problem, answer) {
    const dims = Object.entries(problem.evaluationDimensions)
        .map(([k, v]) => `- ${k}: ${v}`)
        .join('\n');

    return `You are a senior system architect evaluating a system design interview answer.

【Problem】
${problem.title} (${problem.difficulty})
${problem.description.substring(0, 500)}

【Evaluation Dimensions】
${dims}

【Candidate's Answer】
${answer}

Score each dimension 1-10 and provide feedback. Reply in JSON only:
{
  "scores": {
    "apiDesign": 7,
    "dataModel": 8,
    "scalability": 6,
    "tradeoffs": 7,
    "communication": 8
  },
  "overallScore": 7.2,
  "feedback": "Overall assessment in Traditional Chinese",
  "strengths": ["strength1", "strength2"],
  "improvements": ["improvement1", "improvement2"],
  "followUp": "Follow-up question to probe deeper, or null"
}`;
}

module.exports = { buildDesignEvaluationPrompt };
