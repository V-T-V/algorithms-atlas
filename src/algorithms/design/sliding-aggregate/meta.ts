// 滑动窗口聚合 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sliding-aggregate',
  categoryId: 'design',
  title: { zh: '滑动窗口聚合', en: 'Sliding Window Aggregate' },
  summary: {
    zh: '对每个窗口计算聚合值（和/最大/最小），对比朴素、前缀和、单调队列三种策略。',
    en: 'Compute aggregates (sum/max/min) per window, comparing naive, prefix-sum, and monotonic-queue strategies.',
  },
  description: {
    zh: '滑动窗口聚合是数据流处理的基石。对每个大小为 k 的窗口求一个聚合值（和、最大、最小等），不同聚合需要不同数据结构：\n\n- **和/均值**：前缀和 O(n) 预处理 + O(1) 查询；或滑动累加（入加出减）O(n) 单遍\n- **最大/最小**：单调队列 O(n)；或有序结构 O(n log k)\n- **中位数/分位数**：双堆 O(n log k)\n- **去重计数**：哈希频次表 O(n)\n\n本实现把三种典型聚合（sum/max/min）放在一起，展示「按聚合性质选数据结构」的设计思想：\n- sum 用滑动累加（减可逆）\n- max/min 用单调队列（不可逆，需支持高效淘汰过期最大值）\n\n复杂度均为 O(n)。',
    en: 'Sliding-window aggregation underpins stream processing. Computing an aggregate (sum, max, min, ...) for each size-k window demands different structures per aggregate:\n\n- **Sum/mean**: prefix-sum O(n) build + O(1) query; or sliding add/subtract O(n) single pass\n- **Max/min**: monotonic deque O(n); or ordered structure O(n log k)\n- **Median/quantile**: two heaps O(n log k)\n- **Distinct count**: hash frequency map O(n)\n\nThis implementation bundles three typical aggregates (sum/max/min), illustrating "choose the structure by aggregate nature":\n- sum via sliding add/subtract (subtraction is invertible)\n- max/min via monotonic deque (non-invertible; need efficient eviction of expired extremes)\n\nAll run in O(n).',
  },
  tags: ['design', 'sliding-window', 'aggregation', 'monotonic-queue'],
  complexity: { time: 'O(n)', space: 'O(k)' },
};
