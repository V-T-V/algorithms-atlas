// 加一 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'misc-plus-one-2',
  categoryId: 'misc',
  title: { zh: '加一', en: 'Plus One' },
  summary: {
    zh: '用数组表示的非负整数加一，返回结果数组。',
    en: 'Add one to an integer represented as a digit array.',
  },
  description: {
    zh: 'LeetCode 66 加一：给定非负整数数组（每位一个元素）表示一个数，加一后返回。',
    en: 'LeetCode 66 Plus One: given a digit array representing a non-negative integer, add one and return.',
  },
  tags: ['misc', 'array', 'leetcode'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
