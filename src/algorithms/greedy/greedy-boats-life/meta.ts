// 救生艇 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'greedy-boats-life',
  categoryId: 'greedy',
  title: { zh: '救生艇', en: 'Boats to Save People' },
  summary: {
    zh: '每船最多两人且总重不超限，求救所有人所需最少船数。',
    en: 'Each boat carries at most two with total weight under a limit; find the minimum boats to save all.',
  },
  description: {
    zh: '排序后双指针：最轻与最重能同船则配对，否则最重独占一船。',
    en: 'Sort and use two pointers: pair lightest with heaviest if they fit, else the heaviest takes a boat alone.',
  },
  tags: ['greedy', 'two-pointers'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
