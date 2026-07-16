// 快速查找（混合） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'search-fast-2',
  categoryId: 'searching',
  title: { zh: '快速查找（混合）', en: 'Fast Search (Hybrid)' },
  summary: {
    zh: '结合跳步定位与二分：先大步粗定位再细二分。',
    en: 'Combine stepping and binary search: coarse-locate with big steps, then refine with binary.',
  },
  description: {
    zh: '快速查找（Fast Search）是跳跃查找与二分查找的混合：先以较大步长（如 sqrt(n)）粗略定位 target 所在的大致区间，再在该区间内做二分查找。结合了跳跃的快速定位与二分的对数收敛，对中等规模数组实测稳定。时间 O(sqrt(n) + log(sqrt(n)))，仍属亚线性。空间 O(1)。',
    en: "Fast search hybrids jump search and binary search: coarse-locate the target's approximate interval with a large step (e.g. sqrt(n)), then binary search within that interval. It combines jumping's fast location and binary's logarithmic convergence, stable in practice on medium arrays. Time O(sqrt(n) + log(sqrt(n))), still sublinear. Space O(1).",
  },
  tags: ['searching', 'hybrid', 'jump', 'binary', 'sorted'],
  complexity: { time: 'O(sqrt n)', space: 'O(1)' },
};
