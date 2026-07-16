import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'math-next-prime',
  categoryId: 'math',
  title: { zh: '下一个素数', en: 'Next Prime' },
  summary: {
    zh: '返回严格大于 n 的最小素数。',
    en: 'Return the smallest prime strictly greater than n.',
  },
  description: {
    zh: '从 n+1 开始逐个试除判定素数，返回第一个素数。单数判定用试除到 √k。平均时间 O(√n·log n)（素数间隔约 log n），空间 O(1)。',
    en: 'Test n+1, n+2, ... with trial division up to √k; return first prime. Avg time O(√n·log n), space O(1).',
  },
  tags: ['math', 'prime', 'number-theory'],
  complexity: { time: 'O(√n·log n)', space: 'O(1)' },
};
