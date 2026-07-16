import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'partition-number',
  categoryId: 'math',
  title: { zh: '整数划分数', en: 'Partition Number' },
  summary: {
    zh: 'p(n,k)=p(n-1,k-1)+p(n-k,k)；p(n)=Σ_k p(n,k)。',
    en: 'p(n,k)=p(n-1,k-1)+p(n-k,k); p(n)=Σ_k p(n,k).',
  },
  description: {
    zh: '整数划分 p(n) 表示把正整数 n 写成若干正整数之和（不计顺序）的方案数，如 p(4)=5（4, 3+1, 2+2, 2+1+1, 1+1+1+1）。本实现用「恰 k 个部分」的递推：设 p(n,k) 表示 n 拆成恰 k 个正整数之和的方案数。把任意一个含 1 的划分去掉一个 1 得 p(n-1,k-1)；否则所有部分都 ≥2，整体减 1 得 p(n-k,k)。所以 p(n,k)=p(n-1,k-1)+p(n-k,k)，再对 k 求和得 p(n)。时间 O(n²)。',
    en: 'The partition number p(n) is the number of ways to write n as a sum of positive integers disregarding order (p(4)=5). This implementation uses the "exactly k parts" recurrence: p(n,k) = (remove a 1) p(n-1,k-1) + (subtract 1 from each part) p(n-k,k); summing over k gives p(n). Time O(n²).',
  },
  tags: ['math', 'combinatorics', 'partition', 'recurrence'],
  complexity: { time: 'O(n²)', space: 'O(n²)' },
};
