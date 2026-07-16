// 单调递增数字 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'greedy-monotone-2',
  categoryId: 'greedy',
  title: { zh: '单调递增数字', en: 'Monotone Increasing Digits' },
  summary: {
    zh: '求 ≤ n 的最大单调（不降）数字；从右向左修复下降点。',
    en: 'Largest number ≤ n whose digits are non-decreasing; fix descent points right to left.',
  },
  description: {
    zh: 'LeetCode 738 单调递增的数字：找 ≤ n 的最大数字，使各位从高到低不降。从右向左扫描，遇到下降时高位减 1、低位之后全变 9。',
    en: 'LeetCode 738 Monotone Increasing Digits: find largest ≤ n with non-decreasing digits. Scan right-to-left; on a descent, decrement the high digit and set all following to 9.',
  },
  tags: ['greedy', 'leetcode'],
  complexity: { time: 'O(log n)', space: 'O(log n)' },
};
