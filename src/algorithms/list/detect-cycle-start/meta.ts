// Cycle Start · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'detect-cycle-start',
  categoryId: 'list',
  title: { zh: '环入口', en: 'Cycle Start' },
  summary: {
    zh: '环入口属于list类别。',
    en: 'Cycle Start is a list algorithm.',
  },
  description: {
    zh: '环入口（Cycle Start）属于list类别的算法。',
    en: 'Cycle Start is an algorithm in the list category.',
  },
  tags: ["list","linked-list"],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
