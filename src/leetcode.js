/**
 * src/leetcode.js — LeetCode GraphQL Client
 *
 * 透過 LeetCode 公開 GraphQL API 即時取得題目，不需登入、不需資料庫
 */

const LC_GRAPHQL = 'https://leetcode.com/graphql';

const HEADERS = {
    'Content-Type': 'application/json',
    'Referer': 'https://leetcode.com',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
};

// ── GraphQL Queries ──────────────────────────────────────

const QUERY_PROBLEM_LIST = `
query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
  problemsetQuestionList: questionList(
    categorySlug: $categorySlug
    limit: $limit
    skip: $skip
    filters: $filters
  ) {
    total: totalNum
    questions: data {
      frontendQuestionId: questionFrontendId
      title
      titleSlug
      difficulty
      topicTags { name slug }
      acRate
      paidOnly: isPaidOnly
    }
  }
}`;

const QUERY_QUESTION_DETAIL = `
query questionDetail($titleSlug: String!) {
  question(titleSlug: $titleSlug) {
    questionId
    questionFrontendId
    title
    titleSlug
    difficulty
    content
    topicTags { name slug }
    codeSnippets { lang langSlug code }
    exampleTestcaseList
    hints
    acRate
    isPaidOnly
  }
}`;

// ── Helper: HTML → 清理過的純文字 ────────────────────────

function htmlToText(html) {
    if (!html) return '';

    return html
        // 保留 code 內容
        .replace(/<code>(.*?)<\/code>/gi, '`$1`')
        .replace(/<pre>([\s\S]*?)<\/pre>/gi, '\n```\n$1\n```\n')
        // 段落 / 換行
        .replace(/<\/p>/gi, '\n')
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<li>/gi, '• ')
        .replace(/<\/li>/gi, '\n')
        // 粗體 / 斜體
        .replace(/<strong>(.*?)<\/strong>/gi, '**$1**')
        .replace(/<em>(.*?)<\/em>/gi, '*$1*')
        // 移除剩餘 HTML 標籤
        .replace(/<[^>]+>/g, '')
        // HTML entities
        .replace(/&nbsp;/g, ' ')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        // 清理多餘空行
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

// ── 解析題目描述中的 Examples 與 Constraints ─────────────

function parseExamplesAndConstraints(text) {
    const examples = [];
    const constraints = [];

    // 解析 examples：Example 1: Input: ... Output: ... Explanation: ...
    const exRegex = /\*\*Example\s*\d+\s*:\*\*\s*\n?\s*\*\*Input:\*\*\s*(.*?)\n\s*\*\*Output:\*\*\s*(.*?)(?:\n\s*\*\*Explanation:\*\*\s*([\s\S]*?))?(?=\n\s*\*\*Example|\n\s*\*\*Constraints|\n\s*$)/gi;
    let m;
    while ((m = exRegex.exec(text)) !== null) {
        examples.push({
            input: m[1].trim(),
            output: m[2].trim(),
            ...(m[3] ? { explanation: m[3].trim() } : {}),
        });
    }

    // 解析 constraints
    const conMatch = text.match(/\*\*Constraints:\*\*\s*\n([\s\S]*?)$/i);
    if (conMatch) {
        conMatch[1].split('\n').forEach((line) => {
            const cleaned = line.replace(/^[\s•*-]+/, '').replace(/`/g, '').trim();
            if (cleaned) constraints.push(cleaned);
        });
    }

    // 擷取 description（Examples 之前的部分）
    const descEnd = text.search(/\*\*Example\s*\d+/i);
    const description = descEnd > 0 ? text.substring(0, descEnd).trim() : text;

    return { description, examples, constraints };
}

// ── Core: 呼叫 LeetCode GraphQL ──────────────────────────

async function lcGraphQL(query, variables = {}) {
    const res = await fetch(LC_GRAPHQL, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify({ query, variables }),
    });

    if (!res.ok) {
        throw new Error(`LeetCode API 回應 ${res.status}: ${res.statusText}`);
    }

    const json = await res.json();
    if (json.errors) {
        throw new Error(`LeetCode GraphQL error: ${json.errors[0].message}`);
    }
    return json.data;
}

// ── Public API ───────────────────────────────────────────

/**
 * 取得題目列表
 * @param {object} opts - { difficulty, tags, limit, skip }
 */
async function fetchProblemList({ difficulty, tags, limit = 50, skip = 0 } = {}) {
    const filters = {};
    if (difficulty) filters.difficulty = difficulty.toUpperCase(); // EASY / MEDIUM / HARD
    if (tags?.length) filters.tags = tags;

    const data = await lcGraphQL(QUERY_PROBLEM_LIST, {
        categorySlug: 'algorithms',
        limit,
        skip,
        filters,
    });

    const list = data.problemsetQuestionList;
    return {
        total: list.total,
        questions: list.questions
            .filter((q) => !q.paidOnly) // 排除付費題
            .map((q) => ({
                id: q.frontendQuestionId,
                title: q.title,
                titleSlug: q.titleSlug,
                difficulty: q.difficulty.toLowerCase(),
                tags: q.topicTags.map((t) => t.slug),
                acRate: parseFloat(q.acRate?.toFixed(1) || 0),
            })),
    };
}

/**
 * 取得單題完整資訊
 * @param {string} titleSlug - e.g. 'two-sum'
 */
async function fetchProblemDetail(titleSlug) {
    const data = await lcGraphQL(QUERY_QUESTION_DETAIL, { titleSlug });
    const q = data.question;

    if (q.isPaidOnly) {
        throw new Error(`題目 "${titleSlug}" 為 LeetCode Premium 付費題`);
    }

    const rawText = htmlToText(q.content);
    const { description, examples, constraints } = parseExamplesAndConstraints(rawText);

    // 整理 code snippets（函式模板）
    const codeSnippets = {};
    if (q.codeSnippets) {
        for (const s of q.codeSnippets) {
            codeSnippets[s.langSlug] = s.code;
        }
    }

    return {
        id: q.questionFrontendId,
        title: q.title,
        titleSlug: q.titleSlug,
        difficulty: q.difficulty.toLowerCase(),
        category: q.topicTags?.[0]?.slug || 'algorithms',
        description,
        descriptionHtml: q.content || '',  // 原始 HTML，供前端直接渲染
        examples,
        constraints,
        tags: q.topicTags.map((t) => t.slug),
        hints: q.hints || [],
        acRate: parseFloat(q.acRate?.toFixed(1) || 0),
        leetcodeUrl: `https://leetcode.com/problems/${q.titleSlug}/`,
        codeSnippets,
        source: 'leetcode',
    };
}

/**
 * 隨機取 N 道 LeetCode 題目（帶完整描述）
 * @param {number} count - 要取幾題
 * @param {string} difficulty - EASY / MEDIUM / HARD / mixed
 * @param {string[]} tags - 篩選 tag（可選）
 */
async function fetchRandomProblems(count = 3, difficulty = 'mixed', tags = []) {
    // 1. 先取得大量題目列表
    const filters = {};
    if (difficulty && difficulty !== 'mixed') {
        filters.difficulty = difficulty;
    }
    if (tags?.length) filters.tags = tags;

    const listResult = await fetchProblemList({
        ...filters,
        limit: 200, // 取多一點，方便隨機
        skip: 0,
    });

    let pool = listResult.questions;

    // 2. 隨機打亂（Fisher-Yates）
    for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    // 3. 取 count 個
    const selected = pool.slice(0, Math.min(count, pool.length));

    // 4. 對每個取完整資訊（平行呼叫，但限制並發）
    const details = [];
    for (const q of selected) {
        try {
            const detail = await fetchProblemDetail(q.titleSlug);
            details.push(detail);
        } catch (err) {
            console.warn(`[leetcode] 跳過 ${q.titleSlug}: ${err.message}`);
        }
    }

    // 5. 按難度排序：easy → medium → hard
    const order = { easy: 0, medium: 1, hard: 2 };
    details.sort((a, b) => order[a.difficulty] - order[b.difficulty]);

    return details;
}

// ── 取得可用的 tag 列表 ──────────────────────────────────

function getAvailableTags() {
    return [
        { slug: 'array', name: 'Array' },
        { slug: 'string', name: 'String' },
        { slug: 'hash-table', name: 'Hash Table' },
        { slug: 'dynamic-programming', name: 'Dynamic Programming' },
        { slug: 'math', name: 'Math' },
        { slug: 'sorting', name: 'Sorting' },
        { slug: 'greedy', name: 'Greedy' },
        { slug: 'depth-first-search', name: 'DFS' },
        { slug: 'breadth-first-search', name: 'BFS' },
        { slug: 'binary-search', name: 'Binary Search' },
        { slug: 'tree', name: 'Tree' },
        { slug: 'graph', name: 'Graph' },
        { slug: 'linked-list', name: 'Linked List' },
        { slug: 'stack', name: 'Stack' },
        { slug: 'heap-priority-queue', name: 'Heap' },
        { slug: 'sliding-window', name: 'Sliding Window' },
        { slug: 'two-pointers', name: 'Two Pointers' },
        { slug: 'backtracking', name: 'Backtracking' },
        { slug: 'divide-and-conquer', name: 'Divide & Conquer' },
        { slug: 'trie', name: 'Trie' },
    ];
}

module.exports = {
    fetchProblemList,
    fetchProblemDetail,
    fetchRandomProblems,
    getAvailableTags,
};
