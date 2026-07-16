import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'math-part-3',
  categoryId: 'math',
  title: { zh: '整数划分（五边形数定理）', en: 'Integer Partition (Pentagonal)' },
  summary: {
    zh: '用欧拉五边形数定理 O(n√n) 求 n 的划分数 p(n) mod M。',
    en: "Euler's pentagonal number theorem to compute p(n) mod M in O(n√n).",
  },
  description: {
    zh: 'p(n)=Σ (-1)^(k-1) [p(n-k(3k-1)/2)+p(n-k(3k+1)/2)]。广义五边形数 k(3k±1)/2，k=1,2,...。',
    en: 'p(n)=Σ over pentagonal numbers k(3k±1)/2. Linear DP up to n in O(n√n).',
  },
  tags: ['math', 'partition', 'pentagonal'],
  complexity: { time: 'O(n√n)', space: 'O(n)' },
};
