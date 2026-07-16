// 同时找最大和次大 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sel-max1-max2',
  categoryId: 'selection',
  title: { zh: '同时找最大和次大', en: 'Largest and Second Largest' },
  summary: {
    zh: '一遍扫描维护最大值与次大值，O(n)。',
    en: 'Track the largest and second largest in a single pass, O(n).',
  },
  description: {
    zh: '一遍扫描维护 max1 与 max2：若当前更大则 max2=max1, max1=cur；否则若大于 max2 则更新。也可用锦标赛法（n + log n - 2 次比较）。',
    en: 'Scan once maintaining max1 and max2: if larger, shift max1 to max2 and update; else if larger than max2 update it. A tournament method uses n + log n - 2 comparisons.',
  },
  tags: ['selection', 'maximum', 'single-pass'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
