// 同时找最小和次小 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sel-min1-min2',
  categoryId: 'selection',
  title: { zh: '同时找最小和次小', en: 'Smallest and Second Smallest' },
  summary: {
    zh: '一次遍历同时维护最小值与次小值，O(n)。',
    en: 'Track the smallest and second smallest in a single pass, O(n).',
  },
  description: {
    zh: '一遍扫描维护 min1 与 min2：若当前更小则 min2=min1, min1=cur；否则若小于 min2 则更新 min2。比两次扫描更高效。',
    en: 'Scan once maintaining min1 and min2: if the current is smaller, shift min1 to min2 and set min1; else if smaller than min2 update it. More efficient than two passes.',
  },
  tags: ['selection', 'minimum', 'single-pass'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
