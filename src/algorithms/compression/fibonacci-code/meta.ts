// Fibonacci Coding · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'fibonacci-code',
  categoryId: 'compression',
  title: { zh: '斐波那契编码', en: 'Fibonacci Coding' },
  summary: {
    zh: '斐波那契编码属于compression类别。',
    en: 'Fibonacci Coding is a compression algorithm.',
  },
  description: {
    zh: '斐波那契编码（Fibonacci Coding）属于compression类别的算法。',
    en: 'Fibonacci Coding is an algorithm in the compression category.',
  },
  tags: ["compression"],
  complexity: { time: 'O(log n)', space: 'O(log n)' },
};
