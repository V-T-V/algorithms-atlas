// 3 的幂 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'misc-power-of-3',
  categoryId: 'misc',
  title: { zh: '3 的幂', en: 'Power of Three' },
  summary: {
    zh: '判断 n 是否是 3 的幂（不断除以 3 看是否到 1）。',
    en: 'Check if n is a power of three (divide by 3 until reaching 1).',
  },
  description: {
    zh: 'LeetCode 326 3 的幂：n>0 且反复除以 3 最终为 1。也可直接判断 n 是否整除 3^19=1162261467（32 位内最大）。',
    en: 'LeetCode 326 Power of Three: n>0 and dividing by 3 repeatedly reaches 1. Equivalent to n dividing 3^19=1162261467.',
  },
  tags: ['misc', 'math', 'leetcode'],
  complexity: { time: 'O(log n)', space: 'O(1)' },
};
