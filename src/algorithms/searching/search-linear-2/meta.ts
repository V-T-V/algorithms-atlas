// 线性查找（朴素） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'search-linear-2',
  categoryId: 'searching',
  title: { zh: '线性查找（朴素）', en: 'Linear Search (Naive)' },
  summary: {
    zh: '从头到尾逐个比较找目标值，无序数组也可用。',
    en: 'Compare one by one from start to end; works on unsorted arrays.',
  },
  description: {
    zh: '线性查找（顺序查找）：最朴素的查找，从头到尾逐个元素与 target 比较，相等则返回下标，遍历完未命中返回 -1。无需数组有序。时间 O(n)，空间 O(1)。是其它查找算法的基线。',
    en: 'Linear (sequential) search: the most naive search, comparing each element with target from start to end; return the index on equality, -1 if exhausted. No ordering required. Time O(n), space O(1). The baseline for other search algorithms.',
  },
  tags: ['searching', 'linear', 'unsorted', 'naive'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
