// 稳定圈排序 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'cycle-sort-stable',
  categoryId: 'sorting',
  title: { zh: '稳定圈排序', en: 'Stable Cycle Sort' },
  summary: {
    zh: '用 (值, 原下标) 配对作为键，使圈排序保持相等元素的相对顺序。',
    en: 'Pair each value with its original index so cycle sort becomes stable.',
  },
  description: {
    zh:
      '稳定圈排序（Stable Cycle Sort）在标准圈排序的基础上保留稳定性：' +
      '\n- 标准「比 item 小的元素个数」位置计算对相等元素不区分先后，故不稳定。' +
      '\n- 这里把每个元素打包为 `(value, originalIndex)`，比较时先比 value，再比 originalIndex。' +
      '  这样相等元素按原始顺序定序，圈排序便保持稳定。' +
      '\n- 仍保留「每个元素最多写一次」的最小写入特性，适合写入代价高的场景。',
    en:
      'Stable Cycle Sort preserves stability on top of standard cycle sort: ' +
      '\n- Plain "count of smaller elements" does not order equal keys, hence unstable. ' +
      '\n- Here each element is wrapped as `(value, originalIndex)`, compared by value first then by ' +
      'originalIndex. Equal keys keep their input order, making the sort stable. ' +
      '\n- The "at most one write per element" property is retained, suiting write-heavy media.',
  },
  tags: ['sorting', 'cycle', 'in-place', 'stable', 'minimum-writes'],
  complexity: { time: 'O(n²)', space: 'O(n)' },
};
