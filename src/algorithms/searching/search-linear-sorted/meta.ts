// 有序线性查找 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'search-linear-sorted',
  categoryId: 'searching',
  title: { zh: '有序线性查找', en: 'Linear Search on Sorted Array' },
  summary: {
    zh: '在有序数组上线性扫描，遇到大于目标的元素即提前结束。',
    en: 'Linear scan over a sorted array; bail out as soon as an element exceeds the target.',
  },
  description: {
    zh: '有序线性查找：对升序数组从前往后扫描：\n- 命中目标 → 返回索引\n- 当前元素 > 目标 → 立即返回 -1（不可能再找到）\n\n平均情况比无序线性查找更快（目标不存在时提前停止）。最坏仍 O(n)。',
    en: 'Linear search on a sorted (ascending) array: scan forward; return on match, or bail with -1 as soon as current element exceeds the target. Faster on average than unordered linear search when the target is absent. Worst case still O(n).',
  },
  tags: ['searching', 'linear-search', 'sorted', 'early-exit'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
