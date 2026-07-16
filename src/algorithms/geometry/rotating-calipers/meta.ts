// Rotating Calipers · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'rotating-calipers',
  categoryId: 'geometry',
  title: { zh: '旋转卡壳', en: 'Rotating Calipers' },
  summary: {
    zh: '旋转卡壳属于geometry类别。',
    en: 'Rotating Calipers is a geometry algorithm.',
  },
  description: {
    zh: '旋转卡壳（Rotating Calipers）属于geometry类别的算法。',
    en: 'Rotating Calipers is an algorithm in the geometry category.',
  },
  tags: ["geometry"],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
