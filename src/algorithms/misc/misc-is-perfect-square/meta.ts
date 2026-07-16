// 完全平方数判定 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'misc-is-perfect-square',
  categoryId: 'misc',
  title: { zh: '完全平方数判定', en: 'Valid Perfect Square' },
  summary: {
    zh: '用二分/牛顿法判定 num 是否是完全平方数（不用 sqrt）。',
    en: 'Use binary search / Newton method to check if num is a perfect square (no sqrt).',
  },
  description: {
    zh: 'LeetCode 367 有效的完全平方数：二分查找 1..num 中是否有 x 满足 x*x=num。',
    en: 'LeetCode 367 Valid Perfect Square: binary search in 1..num for an x with x*x=num.',
  },
  tags: ['misc', 'math', 'binary-search', 'leetcode'],
  complexity: { time: 'O(log n)', space: 'O(1)' },
};
