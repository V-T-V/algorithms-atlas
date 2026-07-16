import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ds-block-list-2',
  categoryId: 'ds',
  title: { zh: '分块数组（块状链表）', en: 'Block List (SQRT Decomposition)' },
  summary: {
    zh: '把数组分成 √n 大小的块，支持区间加 / 区间查询。',
    en: 'Splits the array into √n-size blocks; supports range-add and range queries.',
  },
  description: {
    zh: '每个块维护本地数据 + 整块懒标记，散块暴力，整块标记。',
    en: 'Each block stores local data plus a lazy tag; partial blocks are brute-forced, full blocks use the tag.',
  },
  tags: ['ds', 'sqrt-decomposition', 'block'],
  complexity: { time: 'O(√n)', space: 'O(n)' },
};
