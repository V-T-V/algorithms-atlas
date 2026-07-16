// 拟阵交（Matroid Intersection）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'greedy-matroid-intersection',
  categoryId: 'greedy',
  title: { zh: '拟阵交', en: 'Matroid Intersection' },
  summary: {
    zh: '求两个拟阵公共独立集的最大基数，贪心增广。',
    en: 'Find the largest set independent in two matroids simultaneously via augmenting paths.',
  },
  description: {
    zh: '拟阵交：M1=(E,I1), M2=(E,I2)，求最大 S 同时属于 I1 与 I2。用增广路径算法，复杂度 O(r²·|E|)。',
    en: 'Matroid intersection: M1=(E,I1), M2=(E,I2); find max S in both. Augmenting-path algorithm in O(r²·|E|).',
  },
  tags: ['greedy', 'matroid', 'combinatorial'],
  complexity: { time: 'O(r²·n)', space: 'O(n)' },
};
