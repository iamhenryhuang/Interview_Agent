/**
 * src/prompts/coding.js
 * Coding Test 程式碼評估 prompt
 */

/**
 * 評估候選人的程式碼（精簡版，節省 token）
 */
function buildCodeEvaluationPrompt(problem, code, language) {
    return `You are a senior software engineer evaluating a coding interview answer.

【Problem】
${problem.title} (${problem.difficulty})
${problem.description}

【Candidate's Code】(${language})
${code}

【Evaluation Criteria】
${problem.evaluationCriteria.join('; ')}

Score each dimension 1-10 and provide brief feedback. Reply in JSON only:
{
  "scores": {
    "correctness": 8,
    "timeComplexity": 7,
    "spaceComplexity": 7,
    "codeQuality": 8,
    "edgeCases": 6
  },
  "overallScore": 7.2,
  "feedback": "Overall assessment in Traditional Chinese",
  "timeComplexity": "O(n)",
  "spaceComplexity": "O(n)",
  "strengths": ["strength1", "strength2"],
  "improvements": ["improvement1", "improvement2"],
  "optimizedApproach": "Brief optimal solution hint if candidate missed it, or null"
}`;
}

module.exports = { buildCodeEvaluationPrompt };
