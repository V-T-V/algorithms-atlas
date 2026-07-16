// 分块（√n 分解）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sqrt-decomposition-design',
  categoryId: 'design',
  title: { zh: '分块（√n 分解）', en: 'Square Root Decomposition' },
  summary: {
    zh: '把数组切成 √n 个块，区间查询/更新 O(√n)。',
    en: 'Split the array into √n blocks for O(√n) range query and update.',
  },
  description: {
    zh: '分块是一种平衡查询与更新的设计技巧：把长度 n 的数组划分为约 √n 个连续块，每块维护聚合信息（如和、最值）。\n\n- 区间查询 [l, r]：完整块直接读聚合，两端的零散元素逐个枚举\n- 单点更新：先改原值再重算所在块聚合\n- 区间更新：完整块打懒标记，零散块暴力下推\n\n时间 O(√n)/操作，是线段树的「简易版」，代码量更小。',
    en: 'Block decomposition balances query and update: split a length-n array into about √n contiguous blocks, each maintaining an aggregate (sum, min, max).\n\n- Range query [l, r]: read aggregates of fully-covered blocks; enumerate the partial blocks at both ends\n- Point update: change the value then recompute its block aggregate\n- Range update: lazy tag for full blocks, push down on partial blocks\n\nO(√n) per operation; a simpler alternative to segment trees with less code.',
  },
  tags: ['sqrt-decomposition', 'design-paradigm', 'data-structure'],
  complexity: { time: 'O(√n)', space: 'O(n)' },
};
