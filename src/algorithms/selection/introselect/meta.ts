// 内省选择 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'introselect',
  categoryId: 'selection',
  title: { zh: '内省选择', en: 'Introselect' },
  summary: {
    zh: '快选为主、递归深度超限时退化到 median-of-medians 保 O(n) 最坏。',
    en: 'Quickselect with depth-limit fallback to median-of-medians for worst-case O(n).',
  },
  description: {
    zh: 'Introselect 是内省排序在选择问题上的对应物：默认用快速选择（随机基准）获得好的平均性能；当递归深度超过 2·log₂(n) 阈值时，切换到 median-of-medians 算法选择基准，保证最坏 O(n)。\n\n- 阶段一：随机化快选，记录递归深度\n- 阶段二：超阈值后改用 BFPRT（中位数的中位数）确定划分点\n- 两者结合：平均常数小，最坏有保证',
    en: 'Introselect is the selection analogue of introsort: it runs randomized quickselect for good average performance, and when recursion depth exceeds 2·log₂(n) it switches to median-of-medians pivot selection to guarantee worst-case O(n).\n\n- Phase 1: randomized quickselect, tracking depth\n- Phase 2: beyond threshold use BFPRT (median of medians) pivot\n- Combines small average constants with a guaranteed worst case',
  },
  tags: ['divide-and-conquer', 'hybrid', 'order-statistics'],
  complexity: { time: 'O(n)', space: 'O(log n)' },
};
