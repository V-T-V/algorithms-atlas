// 快乐数区间（Happy Number Range）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'misc-happy-range',
  categoryId: 'misc',
  title: { zh: '快乐数区间', en: 'Happy Number Range' },
  summary: {
    zh: '统计区间内快乐数个数，每个数反复平方和直到 1 或循环。',
    en: 'Count happy numbers in a range; each repeatedly sums digit-squares until 1 or cycle.',
  },
  description: {
    zh: '快乐数：反复将 n 替换为各位平方和，最终到 1。扫描区间统计快乐数。',
    en: 'Happy: replace n by sum of squares of digits until reaching 1. Count in a range.',
  },
  tags: ['misc', 'number-theory'],
  complexity: { time: 'O(n·log n)', space: 'O(log n)' },
};
