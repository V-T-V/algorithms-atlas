// 去除重复字母（Remove Duplicate Letters, LeetCode 316）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'remove-duplicate-letters',
  categoryId: 'greedy',
  title: { zh: '去除重复字母', en: 'Remove Duplicate Letters' },
  summary: {
    zh: '去重使每个字母出现一次且字典序最小（单调栈）。',
    en: 'Remove duplicates so each letter appears once with minimal lex order (monotone stack).',
  },
  description: {
    zh: '给定字符串 s，去除其中的重复字母，使每个字母只出现一次，且结果字典序最小，同时保持原始相对顺序。\n\n贪心 + 单调栈：维护一个栈作结果。扫描每个字符 ch：\n1) 若 ch 已在栈中，跳过（去重）；\n2) 否则，只要栈顶 > ch 且栈顶字符之后还会再出现，就弹出栈顶（标记为未入栈），再把 ch 入栈。\n用 lastIdx 记录每个字符最后出现位置判断「之后是否还会出现」。结果即字典序最小的去重串。',
    en: 'Given a string s, remove duplicate letters so each letter appears exactly once and the result is lexicographically smallest, while preserving the original relative order.\n\nGreedy + monotone stack: maintain a stack as the result. For each character ch: 1) if ch is already in the stack, skip (dedup); 2) otherwise, while the stack top > ch and the top character appears again later, pop it (mark as not in stack), then push ch. A lastIdx map records the last position of each character to decide "appears again later". The result is the lexicographically smallest deduplicated string.',
  },
  tags: ['greedy', 'stack', 'string'],
  complexity: { time: 'O(n)', space: 'O(1)' },
  references: [
    { label: 'LeetCode 316', url: 'https://leetcode.com/problems/remove-duplicate-letters/' },
  ],
  defaultInput: 'bcabc',
};
