// Gnome Sort · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'gnome-sort',
  categoryId: 'sorting',
  title: { zh: '侏儒排序', en: 'Gnome Sort' },
  summary: {
    zh: '侏儒排序属于sorting类别。',
    en: 'Gnome Sort is a sorting algorithm.',
  },
  description: {
    zh: '侏儒排序（Gnome Sort）属于sorting类别的算法。',
    en: 'Gnome Sort is an algorithm in the sorting category.',
  },
  tags: ["sorting"],
  complexity: { time: 'O(n²)', space: 'O(1)' },
};
