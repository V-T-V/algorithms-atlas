// Mo 算法（离线区间查询）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ds-mo-algorithm-offline',
  categoryId: 'ds',
  title: { zh: 'Mo 算法（离线区间查询）', en: "Mo's Algorithm (Offline Range Query)" },
  summary: {
    zh: '把区间查询排序后用双指针滑动维护答案，O((n+q)√n) 解静态区间众数类问题。',
    en: 'Sort queries then slide a two-pointer window maintaining the answer; O((n+q)√n) for static range-mode queries.',
  },
  description: {
    zh: 'Mo 算法适用于「知道 [l,r] 答案后能 O(1) 扩到 [l±1,r] 或 [l,r±1]」的静态区间查询。把查询按 (l/块大小, r) 奇偶排序后，用 L、R 两个指针依次滑动到每个查询区间，滑动时增量维护频次表与答案。本实现演示求每个查询区间内不同元素的个数（distinct count），并给出通用框架。区别于已有的 mo-algorithm（侧重不同接口）。零 DOM 依赖。',
    en: "Mo's algorithm suits static range queries where extending [l,r] to [l±1,r] or [l,r±1] is O(1). Sort queries by (l/blockSize, r with parity), then slide two pointers L,R, incrementally maintaining a frequency table and the answer. Demonstrates per-query distinct count with a generic framework. Distinct from the existing mo-algorithm. Zero DOM dependency.",
  },
  tags: ['ds', 'mo-algorithm', 'offline-query', 'sqrt-decomposition'],
  complexity: { time: 'O((n+q)√n)', space: 'O(n+Σ)' },
};
