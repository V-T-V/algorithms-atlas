// Graham Scan · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'graham-scan',
  categoryId: 'geometry',
  title: { zh: 'Graham扫描', en: 'Graham Scan' },
  summary: {
    zh: 'Graham扫描属于geometry类别。',
    en: 'Graham Scan is a geometry algorithm.',
  },
  description: {
    zh: 'Graham扫描（Graham Scan）属于geometry类别的算法。',
    en: 'Graham Scan is an algorithm in the geometry category.',
  },
  tags: ["geometry"],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
