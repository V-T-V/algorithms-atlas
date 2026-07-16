import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'math-berlekamp-massey',
  categoryId: 'math',
  title: { zh: 'Berlekamp-Massey 算法', en: 'Berlekamp-Massey Algorithm' },
  summary: {
    zh: '由模域上的序列反推最短线性递推式。',
    en: 'Recover the shortest linear recurrence from a sequence over a prime field.',
  },
  description: {
    zh: '在线算法，每加入一个元素若不满足当前递推则更新递推式。时间 O(n²)，空间 O(n)。要求模素数。',
    en: 'Online: when a new element violates current recurrence, update it. Time O(n²), space O(n). Requires prime modulus.',
  },
  tags: ['math', 'modular', 'recurrence', 'algebra'],
  complexity: { time: 'O(n²)', space: 'O(n)' },
};
