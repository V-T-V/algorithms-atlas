// 整数划分（Integer Partition）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'misc-partition-p',
  categoryId: 'misc',
  title: { zh: '整数划分', en: 'Integer Partition' },
  summary: {
    zh: 'p(n)：把 n 写成正整数和的方案数，不分顺序。',
    en: 'p(n): number of ways to write n as a sum of positive integers, order irrelevant.',
  },
  description: {
    zh: '整数划分：p(n) 用 DP p(n,k)=p(n-1,k-1)+p(n-k,k)，或欧拉五边形定理。',
    en: 'Integer partition: p(n) via DP p(n,k)=p(n-1,k-1)+p(n-k,k), or Euler pentagonal theorem.',
  },
  tags: ['misc', 'combinatorics', 'dp'],
  complexity: { time: 'O(n²)', space: 'O(n)' },
};
