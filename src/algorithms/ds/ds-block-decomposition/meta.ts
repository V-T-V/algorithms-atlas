// 数组分块（块状数组）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ds-block-decomposition',
  categoryId: 'ds',
  title: {
    zh: '数组分块（块状数组，区间和 + 点修改）',
    en: 'Block Decomposition (Sqrt Decomposition, Range Sum + Point Update)',
  },
  summary: {
    zh: '把数组按 √n 分块，预处理块和，支持 O(√n) 点修改与区间求和。',
    en: 'Split the array into √n blocks with per-block sums; O(√n) point update and range sum.',
  },
  description: {
    zh: '块状数组把长度 n 的数组划分为约 √n 个块，每块大小约 √n，维护每块的和（或最值等聚合值）。区间查询 [l,r] 时：整块用预处理的聚合值 O(1) 取，两端零散元素逐个累加 O(√n)。点修改时只更新对应元素与其所在块的聚合值 O(1)（和而言）或 O(√n)。总复杂度 O(√n) 每操作。区别于已有的 block-array（侧重块状数组另一接口）与 fenwick-tree（基于二进制拆分）。零 DOM 依赖。',
    en: 'Sqrt decomposition splits an array of length n into ~√n blocks of size ~√n, keeping a per-block aggregate (sum). Range queries [l,r]: full blocks read the aggregate in O(1), the two partial ends iterate in O(√n). Point update changes the element and its block aggregate. Total O(√n) per operation. Distinct from the existing block-array and fenwick-tree. Zero DOM dependency.',
  },
  tags: ['ds', 'sqrt-decomposition', 'block-array', 'range-query'],
  complexity: { time: 'O(√n) per query', space: 'O(n)' },
};
