// Stable Selection Sort · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'selection-sort-stable',
  categoryId: 'sorting',
  title: { zh: '稳定选择排序', en: 'Stable Selection Sort' },
  summary: {
    zh: '用「插入式」搬移代替交换，保证相等元素的相对顺序不变。',
    en: 'Shifts elements instead of swapping to keep equal keys in original order.',
  },
  description: {
    zh: '稳定选择排序（Stable Selection Sort）在每一轮选出未排序段的最小值后，不直接与未排序段首元素交换，而是把最小值「插入」到未排序段开头（中间元素整体后移一位）。这种搬移方式不会跨越同值元素，因此对相等关键字保持稳定。时间复杂度仍为 O(n²)，空间 O(1)。',
    en: 'Stable Selection Sort finds the minimum of the unsorted prefix each round, then inserts it at the front of that prefix by shifting the intervening elements one step right (rather than a single swap). Because equal keys are never crossed, the sort is stable. Time stays O(n²), space O(1).',
  },
  tags: ['sorting', 'stable', 'in-place', 'selection'],
  complexity: { time: 'O(n²)', space: 'O(1)' },
  attributes: { stable: 'true' },
};
