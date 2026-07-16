// 跳跃查找（黄金步长） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'search-jump-golden',
  categoryId: 'searching',
  title: { zh: '跳跃查找（黄金步长）', en: 'Jump Search (Golden Step)' },
  summary: {
    zh: '用黄金比例 0.618 作为步长因子的跳跃查找。',
    en: 'Jump search using the golden ratio 0.618 as the step factor.',
  },
  description: {
    zh: '跳跃查找（Jump Search）经典版用步长 floor(sqrt(n))。本变体用黄金比例：步长 = floor(n * 0.618)，跳跃探测块右端，定位候选块后线性扫描。黄金步长使块划分更不均匀但概念新颖。时间 O(n/k + k) 仍为 O(sqrt(n)) 量级，空间 O(1)。要求数组已排序。',
    en: "Jump search classically uses step floor(sqrt(n)). This variant uses the golden ratio: step = floor(n * 0.618), jumping to probe the block's right end, then linear-scanning the candidate block. The golden step gives a less even block split but is conceptually novel. Time O(n/k + k), still O(sqrt(n)); space O(1). Requires a sorted array.",
  },
  tags: ['searching', 'jump', 'sorted', 'golden-ratio'],
  complexity: { time: 'O(sqrt n)', space: 'O(1)' },
};
