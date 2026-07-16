// Wavelet Tree · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'wavelet',
  categoryId: 'tree',
  title: { zh: '小波树', en: 'Wavelet Tree' },
  summary: {
    zh: '小波树属于tree类别。',
    en: 'Wavelet Tree is a tree algorithm.',
  },
  description: {
    zh: '小波树（Wavelet Tree）属于tree类别的算法。',
    en: 'Wavelet Tree is an algorithm in the tree category.',
  },
  tags: ["tree"],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
