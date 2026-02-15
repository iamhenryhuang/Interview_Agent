/**
 * coding-questions.js — 精選 LeetCode 面試高頻題庫
 * 本地題庫，不需 API 呼叫即可取得題目
 */

const codingQuestions = [
  // ── Easy ─────────────────────────────────────────────
  {
    id: 'c01',
    title: 'Two Sum',
    difficulty: 'easy',
    category: 'array',
    description:
      'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.',
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9' },
    ],
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', 'Only one valid answer exists.'],
    evaluationCriteria: ['Correct use of hash map for O(n) solution', 'Handle edge cases', 'Time complexity: O(n), Space: O(n)'],
    tags: ['hash-map', 'array'],
  },
  {
    id: 'c02',
    title: 'Valid Parentheses',
    difficulty: 'easy',
    category: 'stack',
    description:
      'Given a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.',
    examples: [
      { input: 's = "()"', output: 'true' },
      { input: 's = "()[]{}"', output: 'true' },
      { input: 's = "(]"', output: 'false' },
    ],
    constraints: ['1 <= s.length <= 10^4', 's consists of parentheses only'],
    evaluationCriteria: ['Stack-based approach', 'Handle empty string', 'Time: O(n), Space: O(n)'],
    tags: ['stack', 'string'],
  },
  {
    id: 'c03',
    title: 'Merge Two Sorted Lists',
    difficulty: 'easy',
    category: 'linked-list',
    description:
      'You are given the heads of two sorted linked lists `list1` and `list2`. Merge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists.\n\nReturn the head of the merged linked list.',
    examples: [
      { input: 'list1 = [1,2,4], list2 = [1,3,4]', output: '[1,1,2,3,4,4]' },
    ],
    constraints: ['The number of nodes in both lists is in the range [0, 50]', '-100 <= Node.val <= 100'],
    evaluationCriteria: ['Iterative or recursive approach', 'Handle empty lists', 'Time: O(n+m), Space: O(1) for iterative'],
    tags: ['linked-list', 'recursion'],
  },
  {
    id: 'c04',
    title: 'Best Time to Buy and Sell Stock',
    difficulty: 'easy',
    category: 'array',
    description:
      'You are given an array `prices` where `prices[i]` is the price of a given stock on the i-th day. You want to maximize your profit by choosing a single day to buy and a single day to sell.\n\nReturn the maximum profit you can achieve. If no profit is possible, return 0.',
    examples: [
      { input: 'prices = [7,1,5,3,6,4]', output: '5', explanation: 'Buy on day 2 (price = 1), sell on day 5 (price = 6)' },
    ],
    constraints: ['1 <= prices.length <= 10^5', '0 <= prices[i] <= 10^4'],
    evaluationCriteria: ['Track minimum price seen so far', 'Single pass O(n)', 'Handle all-decreasing prices'],
    tags: ['array', 'greedy'],
  },
  {
    id: 'c05',
    title: 'Maximum Subarray',
    difficulty: 'easy',
    category: 'array',
    description:
      'Given an integer array `nums`, find the subarray with the largest sum, and return its sum.',
    examples: [
      { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: 'The subarray [4,-1,2,1] has the largest sum 6.' },
    ],
    constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4'],
    evaluationCriteria: ["Kadane's algorithm", 'Handle all-negative arrays', 'Time: O(n), Space: O(1)'],
    tags: ['array', 'dynamic-programming'],
  },
  {
    id: 'c06',
    title: 'Reverse Linked List',
    difficulty: 'easy',
    category: 'linked-list',
    description: 'Given the head of a singly linked list, reverse the list, and return the reversed list.',
    examples: [
      { input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]' },
    ],
    constraints: ['The number of nodes in the list is the range [0, 5000]', '-5000 <= Node.val <= 5000'],
    evaluationCriteria: ['Iterative approach with prev/curr pointers', 'Or recursive approach', 'Time: O(n), Space: O(1) iterative'],
    tags: ['linked-list'],
  },

  // ── Medium ───────────────────────────────────────────
  {
    id: 'c07',
    title: 'Add Two Numbers',
    difficulty: 'medium',
    category: 'linked-list',
    description:
      'You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each node contains a single digit. Add the two numbers and return the sum as a linked list.',
    examples: [
      { input: 'l1 = [2,4,3], l2 = [5,6,4]', output: '[7,0,8]', explanation: '342 + 465 = 807' },
    ],
    constraints: ['The number of nodes in each list is in the range [1, 100]', '0 <= Node.val <= 9'],
    evaluationCriteria: ['Handle carry correctly', 'Handle lists of different lengths', 'Time: O(max(m,n))'],
    tags: ['linked-list', 'math'],
  },
  {
    id: 'c08',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'medium',
    category: 'string',
    description:
      'Given a string `s`, find the length of the longest substring without repeating characters.',
    examples: [
      { input: 's = "abcabcbb"', output: '3', explanation: 'The answer is "abc", with length 3.' },
      { input: 's = "bbbbb"', output: '1' },
    ],
    constraints: ['0 <= s.length <= 5 * 10^4', 's consists of English letters, digits, symbols and spaces'],
    evaluationCriteria: ['Sliding window approach', 'Use Set or Map to track characters', 'Time: O(n), Space: O(min(n, charset))'],
    tags: ['string', 'sliding-window', 'hash-map'],
  },
  {
    id: 'c09',
    title: '3Sum',
    difficulty: 'medium',
    category: 'array',
    description:
      'Given an integer array `nums`, return all the triplets `[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, and `j != k`, and `nums[i] + nums[j] + nums[k] == 0`.\n\nThe solution set must not contain duplicate triplets.',
    examples: [
      { input: 'nums = [-1,0,1,2,-1,-4]', output: '[[-1,-1,2],[-1,0,1]]' },
    ],
    constraints: ['3 <= nums.length <= 3000', '-10^5 <= nums[i] <= 10^5'],
    evaluationCriteria: ['Sort + two-pointer approach', 'Handle duplicate skipping', 'Time: O(n^2)'],
    tags: ['array', 'two-pointer', 'sorting'],
  },
  {
    id: 'c10',
    title: 'Merge Intervals',
    difficulty: 'medium',
    category: 'array',
    description:
      'Given an array of intervals where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.',
    examples: [
      { input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]', output: '[[1,6],[8,10],[15,18]]' },
    ],
    constraints: ['1 <= intervals.length <= 10^4', 'intervals[i].length == 2'],
    evaluationCriteria: ['Sort by start time', 'Merge overlapping intervals', 'Time: O(n log n)'],
    tags: ['array', 'sorting'],
  },
  {
    id: 'c11',
    title: 'Product of Array Except Self',
    difficulty: 'medium',
    category: 'array',
    description:
      'Given an integer array `nums`, return an array `answer` such that `answer[i]` is equal to the product of all the elements of `nums` except `nums[i]`.\n\nYou must write an algorithm that runs in O(n) time and without using the division operation.',
    examples: [
      { input: 'nums = [1,2,3,4]', output: '[24,12,8,6]' },
    ],
    constraints: ['2 <= nums.length <= 10^5', '-30 <= nums[i] <= 30'],
    evaluationCriteria: ['Prefix and suffix product approach', 'No division operator', 'Time: O(n), Space: O(1) extra'],
    tags: ['array', 'prefix-sum'],
  },
  {
    id: 'c12',
    title: 'Binary Tree Level Order Traversal',
    difficulty: 'medium',
    category: 'tree',
    description:
      'Given the root of a binary tree, return the level order traversal of its nodes\' values (i.e., from left to right, level by level).',
    examples: [
      { input: 'root = [3,9,20,null,null,15,7]', output: '[[3],[9,20],[15,7]]' },
    ],
    constraints: ['The number of nodes is in the range [0, 2000]', '-1000 <= Node.val <= 1000'],
    evaluationCriteria: ['BFS with queue', 'Handle empty tree', 'Time: O(n), Space: O(n)'],
    tags: ['tree', 'bfs'],
  },
  {
    id: 'c13',
    title: 'Number of Islands',
    difficulty: 'medium',
    category: 'graph',
    description:
      'Given an m x n 2D binary grid which represents a map of "1"s (land) and "0"s (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.',
    examples: [
      {
        input: 'grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]',
        output: '3',
      },
    ],
    constraints: ['m == grid.length', 'n == grid[i].length', '1 <= m, n <= 300'],
    evaluationCriteria: ['DFS or BFS flood fill', 'Mark visited cells', 'Time: O(m*n)'],
    tags: ['graph', 'dfs', 'bfs'],
  },
  {
    id: 'c14',
    title: 'Validate Binary Search Tree',
    difficulty: 'medium',
    category: 'tree',
    description:
      'Given the root of a binary tree, determine if it is a valid binary search tree (BST). A valid BST has the following properties:\n- The left subtree only contains nodes with keys less than the node\'s key.\n- The right subtree only contains nodes with keys greater than the node\'s key.\n- Both subtrees must also be valid BSTs.',
    examples: [
      { input: 'root = [2,1,3]', output: 'true' },
      { input: 'root = [5,1,4,null,null,3,6]', output: 'false' },
    ],
    constraints: ['The number of nodes is in the range [1, 10^4]'],
    evaluationCriteria: ['Use min/max bounds recursively', 'Or in-order traversal approach', 'Time: O(n)'],
    tags: ['tree', 'dfs', 'bst'],
  },
  {
    id: 'c15',
    title: 'LRU Cache',
    difficulty: 'medium',
    category: 'design',
    description:
      'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.\n\nImplement the `LRUCache` class:\n- `LRUCache(int capacity)` — initialize with positive size capacity\n- `int get(int key)` — return the value if exists, otherwise -1\n- `void put(int key, int value)` — update or insert. If capacity exceeded, evict the least recently used key.',
    examples: [
      {
        input: '["LRUCache","put","put","get","put","get","put","get","get","get"]\n[[2],[1,1],[2,2],[1],[3,3],[2],[4,4],[1],[3],[4]]',
        output: '[null,null,null,1,null,-1,null,-1,3,4]',
      },
    ],
    constraints: ['1 <= capacity <= 3000', '0 <= key <= 10^4', 'At most 2 * 10^5 calls'],
    evaluationCriteria: ['Hash map + doubly linked list', 'O(1) get and put', 'Proper eviction logic'],
    tags: ['hash-map', 'linked-list', 'design'],
  },
  {
    id: 'c16',
    title: 'Coin Change',
    difficulty: 'medium',
    category: 'dynamic-programming',
    description:
      'You are given an integer array `coins` representing different denominations and an integer `amount` representing a total amount of money. Return the fewest number of coins needed to make up that amount. If it cannot be made up, return -1.',
    examples: [
      { input: 'coins = [1,5,11], amount = 15', output: '3', explanation: '15 = 5 + 5 + 5' },
    ],
    constraints: ['1 <= coins.length <= 12', '1 <= coins[i] <= 2^31 - 1', '0 <= amount <= 10^4'],
    evaluationCriteria: ['Bottom-up DP approach', 'dp[i] = min coins for amount i', 'Time: O(amount * coins), Space: O(amount)'],
    tags: ['dynamic-programming'],
  },
  {
    id: 'c17',
    title: 'Implement Trie (Prefix Tree)',
    difficulty: 'medium',
    category: 'design',
    description:
      'Implement a Trie with the following operations:\n- `insert(word)` — inserts word into the trie\n- `search(word)` — returns true if the word is in the trie\n- `startsWith(prefix)` — returns true if any word starts with the given prefix',
    examples: [
      {
        input: '["Trie","insert","search","search","startsWith","insert","search"]\n[[],["apple"],["apple"],["app"],["app"],["app"],["app"]]',
        output: '[null,null,true,false,true,null,true]',
      },
    ],
    constraints: ['1 <= word.length, prefix.length <= 2000', 'word and prefix consist only of lowercase English letters'],
    evaluationCriteria: ['Correct TrieNode structure', 'distinguish end-of-word vs prefix', 'Time: O(m) per operation'],
    tags: ['trie', 'design'],
  },
  {
    id: 'c18',
    title: 'Course Schedule',
    difficulty: 'medium',
    category: 'graph',
    description:
      'There are a total of `numCourses` courses labeled from 0 to numCourses - 1. You are given an array `prerequisites` where `prerequisites[i] = [ai, bi]` indicates that you must take course bi before course ai.\n\nReturn true if you can finish all courses. Otherwise, return false.',
    examples: [
      { input: 'numCourses = 2, prerequisites = [[1,0]]', output: 'true' },
      { input: 'numCourses = 2, prerequisites = [[1,0],[0,1]]', output: 'false' },
    ],
    constraints: ['1 <= numCourses <= 2000', '0 <= prerequisites.length <= 5000'],
    evaluationCriteria: ['Topological sort or DFS cycle detection', 'Build adjacency list', 'Time: O(V+E)'],
    tags: ['graph', 'topological-sort', 'dfs'],
  },
  {
    id: 'c19',
    title: 'Word Search',
    difficulty: 'medium',
    category: 'graph',
    description:
      'Given an m x n grid of characters `board` and a string `word`, return true if `word` exists in the grid. The word can be constructed from letters of sequentially adjacent cells (horizontal or vertical). The same cell may not be used more than once.',
    examples: [
      { input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"', output: 'true' },
    ],
    constraints: ['m == board.length', 'n = board[i].length', '1 <= m, n <= 6', '1 <= word.length <= 15'],
    evaluationCriteria: ['DFS backtracking', 'Mark visited cells and unmark on backtrack', 'Time: O(m*n*4^L)'],
    tags: ['backtracking', 'dfs', 'matrix'],
  },
  {
    id: 'c20',
    title: 'Clone Graph',
    difficulty: 'medium',
    category: 'graph',
    description:
      'Given a reference of a node in a connected undirected graph, return a deep copy (clone) of the graph. Each node in the graph contains a value and a list of its neighbors.',
    examples: [
      { input: 'adjList = [[2,4],[1,3],[2,4],[1,3]]', output: '[[2,4],[1,3],[2,4],[1,3]]' },
    ],
    constraints: ['The number of nodes is in the range [0, 100]', '1 <= Node.val <= 100', 'No repeated edges or self-loops'],
    evaluationCriteria: ['BFS or DFS with hash map for visited', 'Correctly clone all neighbors', 'Time: O(V+E)'],
    tags: ['graph', 'dfs', 'bfs', 'hash-map'],
  },

  // ── Hard ─────────────────────────────────────────────
  {
    id: 'c21',
    title: 'Median of Two Sorted Arrays',
    difficulty: 'hard',
    category: 'array',
    description:
      'Given two sorted arrays `nums1` and `nums2` of size m and n respectively, return the median of the two sorted arrays. The overall run time complexity should be O(log (m+n)).',
    examples: [
      { input: 'nums1 = [1,3], nums2 = [2]', output: '2.0' },
      { input: 'nums1 = [1,2], nums2 = [3,4]', output: '2.5' },
    ],
    constraints: ['0 <= m, n <= 1000', '-10^6 <= nums1[i], nums2[i] <= 10^6'],
    evaluationCriteria: ['Binary search approach on the smaller array', 'O(log(min(m,n))) time', 'Handle even/odd total length'],
    tags: ['binary-search', 'array'],
  },
  {
    id: 'c22',
    title: 'Trapping Rain Water',
    difficulty: 'hard',
    category: 'array',
    description:
      'Given `n` non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
    examples: [
      { input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', output: '6' },
    ],
    constraints: ['n == height.length', '1 <= n <= 2 * 10^4', '0 <= height[i] <= 10^5'],
    evaluationCriteria: ['Two-pointer or stack approach', 'Track left/right max', 'Time: O(n), Space: O(1) for two-pointer'],
    tags: ['two-pointer', 'stack', 'array'],
  },
  {
    id: 'c23',
    title: 'Merge k Sorted Lists',
    difficulty: 'hard',
    category: 'linked-list',
    description:
      'You are given an array of `k` linked-lists, each sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.',
    examples: [
      { input: 'lists = [[1,4,5],[1,3,4],[2,6]]', output: '[1,1,2,3,4,4,5,6]' },
    ],
    constraints: ['k == lists.length', '0 <= k <= 10^4', '0 <= lists[i].length <= 500'],
    evaluationCriteria: ['Min-heap / priority queue approach', 'Or divide-and-conquer merge', 'Time: O(N log k)'],
    tags: ['linked-list', 'heap', 'divide-and-conquer'],
  },
  {
    id: 'c24',
    title: 'Word Ladder',
    difficulty: 'hard',
    category: 'graph',
    description:
      'Given two words `beginWord` and `endWord`, and a dictionary\'s word list, return the number of words in the shortest transformation sequence from beginWord to endWord. Only one letter can be changed at a time, and each transformed word must exist in the word list.',
    examples: [
      {
        input: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]',
        output: '5',
        explanation: '"hit" -> "hot" -> "dot" -> "dog" -> "cog"',
      },
    ],
    constraints: ['1 <= beginWord.length <= 10', 'endWord.length == beginWord.length', '1 <= wordList.length <= 5000'],
    evaluationCriteria: ['BFS shortest path', 'Build adjacency with wildcard patterns', 'Time: O(M^2 * N)'],
    tags: ['bfs', 'graph', 'string'],
  },
  {
    id: 'c25',
    title: 'Longest Increasing Subsequence',
    difficulty: 'medium',
    category: 'dynamic-programming',
    description:
      'Given an integer array `nums`, return the length of the longest strictly increasing subsequence.',
    examples: [
      { input: 'nums = [10,9,2,5,3,7,101,18]', output: '4', explanation: 'The longest increasing subsequence is [2,3,7,101]' },
    ],
    constraints: ['1 <= nums.length <= 2500', '-10^4 <= nums[i] <= 10^4'],
    evaluationCriteria: ['DP or binary search approach', 'O(n^2) DP or O(n log n) with patience sorting', 'Handle edge cases'],
    tags: ['dynamic-programming', 'binary-search'],
  },
  {
    id: 'c26',
    title: 'Min Stack',
    difficulty: 'medium',
    category: 'design',
    description:
      'Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.\n\n- `push(val)` — pushes element onto stack\n- `pop()` — removes element on top\n- `top()` — gets top element\n- `getMin()` — retrieves minimum element',
    examples: [
      {
        input: '["MinStack","push","push","push","getMin","pop","top","getMin"]\n[[],[-2],[0],[-3],[],[],[],[]]',
        output: '[null,null,null,null,-3,null,0,-2]',
      },
    ],
    constraints: ['-2^31 <= val <= 2^31 - 1', 'pop, top and getMin always called on non-empty stacks'],
    evaluationCriteria: ['Two-stack approach or tuple stack', 'O(1) for all operations', 'Handle duplicates'],
    tags: ['stack', 'design'],
  },
  {
    id: 'c27',
    title: 'Maximum Product Subarray',
    difficulty: 'medium',
    category: 'dynamic-programming',
    description:
      'Given an integer array `nums`, find a subarray that has the largest product, and return the product.',
    examples: [
      { input: 'nums = [2,3,-2,4]', output: '6', explanation: '[2,3] has the largest product 6.' },
    ],
    constraints: ['1 <= nums.length <= 2 * 10^4', '-10 <= nums[i] <= 10'],
    evaluationCriteria: ['Track both max and min products', 'Handle negative numbers flipping sign', 'Time: O(n)'],
    tags: ['dynamic-programming', 'array'],
  },
  {
    id: 'c28',
    title: 'Group Anagrams',
    difficulty: 'medium',
    category: 'string',
    description:
      'Given an array of strings `strs`, group the anagrams together. You can return the answer in any order.',
    examples: [
      { input: 'strs = ["eat","tea","tan","ate","nat","bat"]', output: '[["bat"],["nat","tan"],["ate","eat","tea"]]' },
    ],
    constraints: ['1 <= strs.length <= 10^4', '0 <= strs[i].length <= 100', 'strs[i] consists of lowercase English letters'],
    evaluationCriteria: ['Sort each string as key or use character count', 'Hash map grouping', 'Time: O(N * K log K) or O(N * K)'],
    tags: ['hash-map', 'string', 'sorting'],
  },
  {
    id: 'c29',
    title: 'Serialize and Deserialize Binary Tree',
    difficulty: 'hard',
    category: 'tree',
    description:
      'Design an algorithm to serialize a binary tree into a string and deserialize that string back to the original tree structure.\n\nThere is no restriction on how your serialization/deserialization algorithm should work. You just need to ensure that a binary tree can be serialized to a string and this string can be deserialized to the original tree structure.',
    examples: [
      { input: 'root = [1,2,3,null,null,4,5]', output: '[1,2,3,null,null,4,5]' },
    ],
    constraints: ['The number of nodes is in the range [0, 10^4]', '-1000 <= Node.val <= 1000'],
    evaluationCriteria: ['BFS or pre-order DFS approach', 'Handle null nodes properly', 'Encode/decode is inverse'],
    tags: ['tree', 'dfs', 'bfs', 'design'],
  },
  {
    id: 'c30',
    title: 'Find Median from Data Stream',
    difficulty: 'hard',
    category: 'design',
    description:
      'The median is the middle value in an ordered integer list. If the list size is even, the median is the mean of the two middle values.\n\nImplement the MedianFinder class:\n- `addNum(int num)` — adds num to the data structure\n- `findMedian()` — returns the median of all elements so far',
    examples: [
      {
        input: '["MedianFinder","addNum","addNum","findMedian","addNum","findMedian"]\n[[],[1],[2],[],[3],[]]',
        output: '[null,null,null,1.5,null,2.0]',
      },
    ],
    constraints: ['-10^5 <= num <= 10^5', 'At most 5 * 10^4 calls to addNum and findMedian'],
    evaluationCriteria: ['Two-heap approach (max-heap + min-heap)', 'Balance heaps after each insert', 'O(log n) add, O(1) find'],
    tags: ['heap', 'design'],
  },
];

/**
 * 隨機選取 n 道題目，按難度排序
 */
function selectCodingQuestions(count = 3, difficulty = 'mixed') {
  let pool = [...codingQuestions];

  if (difficulty !== 'mixed') {
    pool = pool.filter((q) => q.difficulty === difficulty);
  }

  // Shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  const selected = pool.slice(0, Math.min(count, pool.length));

  // Sort by difficulty: easy → medium → hard
  const order = { easy: 0, medium: 1, hard: 2 };
  selected.sort((a, b) => order[a.difficulty] - order[b.difficulty]);

  return selected;
}

module.exports = { codingQuestions, selectCodingQuestions };
