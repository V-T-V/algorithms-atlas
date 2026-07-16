// 选择排序（双向） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sort-selection-bidir',
  categoryId: 'sorting',
  title: { zh: '选择排序（双向）', en: 'Selection Sort (Bidirectional)' },
  summary: {
    zh: '每轮同时选出最小和最大，分别放到两端，趟数减半。',
    en: 'Each round pick both min and max, placing them at the two ends; halves the rounds.',
  },
  description: {
    zh: '双向选择排序（Double Selection Sort / Cocktail Selection）每轮在未排序段 [lo, hi] 中同时找最小值和最大值：最小值放 lo，最大值放 hi，然后 lo++、hi--。比单向选择排序少了约一半的轮数，但每轮比较次数略多（同时维护 min 和 max）。需注意当最大值恰在 lo 时的索引修正。比较次数仍 O(n^2)，不稳定，原地。',
    en: 'Bidirectional (double) selection sort finds both min and max in the unsorted window [lo,hi] each round: place min at lo, max at hi, then lo++, hi--. This halves the number of rounds versus one-way selection while each round does slightly more work (tracking min and max together), with a fixup when the max sits at lo. Still O(n^2) comparisons, unstable, in-place.',
  },
  tags: ['sorting', 'comparison', 'in-place', 'selection'],
  complexity: { time: 'O(n^2)', space: 'O(1)' },
};
