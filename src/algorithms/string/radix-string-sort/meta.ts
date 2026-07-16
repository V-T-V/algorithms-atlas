// MSD Radix String Sort · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'radix-string-sort',
  categoryId: 'string',
  title: { zh: '字符串基数排序（MSD）', en: 'MSD Radix String Sort' },
  summary: {
    zh: '字符串基数排序（MSD）属于string类别。',
    en: 'MSD Radix String Sort is a string algorithm.',
  },
  description: {
    zh: '字符串基数排序（MSD）（MSD Radix String Sort）属于string类别的算法。',
    en: 'MSD Radix String Sort is an algorithm in the string category.',
  },
  tags: ["string","sorting"],
  complexity: { time: 'O(N·L)', space: 'O(N+R)' },
};
