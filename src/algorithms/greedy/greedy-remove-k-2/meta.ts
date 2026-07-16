// 移掉 K 位数字 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'greedy-remove-k-2',
  categoryId: 'greedy',
  title: { zh: '移掉 K 位数字', en: 'Remove K Digits' },
  summary: {
    zh: '从数字字符串中删 k 位使剩余数最小；用单调栈。',
    en: 'Remove k digits from the string to minimize the remaining number; use a monotonic stack.',
  },
  description: {
    zh: 'LeetCode 402 移掉 K 位数字：给定 num 字符串和 k，删除 k 位后使剩下的数最小。单调栈：栈顶大于当前就弹出。',
    en: 'LeetCode 402 Remove K Digits: given num and k, remove k digits to minimize the result. Monotonic stack: pop top while it exceeds the current digit.',
  },
  tags: ['greedy', 'stack', 'leetcode'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
