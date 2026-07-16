// 整数划分 P(n) · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'partition-p',
  categoryId: 'math',
  title: { zh: '整数划分 P(n)', en: 'Integer Partition p(n)' },
  summary: {
    zh: '用五边形数定理在 O(n√n) 计算 p(n)=n 的拆分方案数。',
    en: 'Compute p(n), the number of partitions of n, in O(n√n) via the pentagonal number theorem.',
  },
  description: {
    zh: '整数划分 p(n) 表示把 n 写成正整数之和（不计顺序）的方案数。欧拉五边形数定理给出高效递推：p(n) = Σ_{k} (−1)^{k+1} [ p(n − k(3k−1)/2) + p(n − k(3k+1)/2) ]，k=±1,±2,...。只需 O(√n) 项即可递推到 p(n)，总时间 O(n√n)。BigInt 精确。区别于基于最大部分数 dp 的 O(n²) 版本。',
    en: 'The partition number p(n) counts the ways to write n as a sum of positive integers, order irrelevant. Eulers pentagonal number theorem gives an efficient recurrence p(n) = Σ_{k} (−1)^{k+1} [ p(n − k(3k−1)/2) + p(n − k(3k+1)/2) ], k=±1,±2,.... Only O(√n) terms are needed, so the total time is O(n√n). Exact BigInt. Distinct from the O(n²) max-part DP variant.',
  },
  tags: ['math', 'combinatorics', 'partition', 'pentagonal'],
  complexity: { time: 'O(n√n)', space: 'O(n)' },
};
