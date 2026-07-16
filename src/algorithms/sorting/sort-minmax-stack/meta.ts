// 选择排序（双栈极值） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sort-minmax-stack',
  categoryId: 'sorting',
  title: { zh: '选择排序（双栈极值）', en: 'Selection Sort (Min-Max Stack)' },
  summary: {
    zh: '每轮同时选最小和最大，分别压入结果两端。',
    en: 'Each round select both min and max, pushing them to the two ends of the result.',
  },
  description: {
    zh: '双极值选择排序：每轮在剩余元素中扫描一次找出最小和最大，把最小放到结果左端、最大放到结果右端，剩余区间 [lo+1, hi-1] 继续。比单极值选择少一半轮数，但每轮比较约 2(n)。本实现用一个额外结果数组从两端向中间填。比较 O(n^2)，不稳定。',
    en: 'Min-max selection sort: each round scans the remaining elements once to find both the min and the max, placing the min at the left end and the max at the right end, then narrowing [lo+1, hi-1]. This halves the number of rounds versus single-extremum selection but each round does about 2(n) comparisons. This implementation fills an extra result array from both ends toward the middle. Comparisons O(n^2), unstable.',
  },
  tags: ['sorting', 'comparison', 'selection'],
  complexity: { time: 'O(n^2)', space: 'O(n)' },
};
