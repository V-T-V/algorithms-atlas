// Triangular Number · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'triangular-number',
  categoryId: 'math',
  title: { zh: '三角数', en: 'Triangular Number' },
  summary: {
    zh: '第 n 个三角数 T(n)=n(n+1)/2 及其判定。',
    en: 'The n-th triangular number T(n)=n(n+1)/2 and its test.',
  },
  description: {
    zh: '三角数 T(n) = 1+2+…+n = n(n+1)/2，对应排成等边三角形的点数：1, 3, 6, 10, 15, 21, ...。判定一个数 x 是否为三角数：x = T(k) iff 8x+1 是完全平方数（且 k=(√(8x+1)-1)/2 为正整数）。本实现提供：生成前 n 个三角数、判定、求 x 是第几个三角数。',
    en: 'Triangular number T(n) = 1+2+…+n = n(n+1)/2, dots forming an equilateral triangle: 1, 3, 6, 10, 15, 21, .... A number x is triangular iff 8x+1 is a perfect square (and k=(√(8x+1)-1)/2 is a positive integer). We provide: first n triangulars, the test, and the rank of x.',
  },
  tags: ['math', 'figurate', 'triangular', 'sequence'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
