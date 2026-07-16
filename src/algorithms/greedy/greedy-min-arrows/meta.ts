// 最少箭射气球 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'greedy-min-arrows',
  categoryId: 'greedy',
  title: { zh: '最少箭射爆气球', en: 'Minimum Arrows to Burst Balloons' },
  summary: {
    zh: '数轴上若干气球区间，一支箭可射爆重叠的一组，求最少箭数。',
    en: 'Balloons as intervals on a line; one arrow bursts an overlapping group; find the minimum arrows.',
  },
  description: {
    zh: '按右端点排序，贪心：每当当前气球的左端 > 当前箭位置，需新箭。',
    en: 'Sort by right endpoint; greedily fire a new arrow whenever a balloon starts after the current arrow position.',
  },
  tags: ['greedy', 'interval'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
