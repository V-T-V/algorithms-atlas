import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'math-prev-prime',
  categoryId: 'math',
  title: { zh: '上一个素数', en: 'Previous Prime' },
  summary: {
    zh: '返回严格小于 n 的最大素数（无解时返回 -1）。',
    en: 'Return the largest prime strictly less than n (-1 if none).',
  },
  description: {
    zh: '从 n-1 向下递减，第一个满足试除判定的整数即为答案。对 n≤2 返回 -1。',
    en: 'Decrement from n-1, return first prime found by trial division. Return -1 for n≤2.',
  },
  tags: ['math', 'prime', 'number-theory'],
  complexity: { time: 'O(√n·log n)', space: 'O(1)' },
};
