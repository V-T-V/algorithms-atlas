// Tetrahedral Number · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'tetrahedral-number',
  categoryId: 'math',
  title: { zh: '四面体数', en: 'Tetrahedral Number' },
  summary: {
    zh: '第 n 个四面体数 Te(n)=n(n+1)(n+2)/6。',
    en: 'The n-th tetrahedral number Te(n)=n(n+1)(n+2)/6.',
  },
  description: {
    zh: '四面体数是三角数的前缀和，对应堆成四面体（三角锥）的球数：1, 4, 10, 20, 35, 56, ...。Te(n) = C(n+2, 3) = n(n+1)(n+2)/6。判定 x 是否为四面体数：解 3 次方程或枚举。本实现给出生成、判定（解方程验证）。第 n 个 O(1)。',
    en: 'Tetrahedral numbers are prefix sums of triangular numbers, balls stacked in a tetrahedron: 1, 4, 10, 20, 35, 56, .... Te(n) = C(n+2, 3) = n(n+1)(n+2)/6. We provide generation and the test (via solving). Computing the n-th is O(1).',
  },
  tags: ['math', 'figurate', 'tetrahedral', 'pyramidal', 'sequence'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
