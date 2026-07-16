// Floyd · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'floyd-cycle',
  categoryId: 'list',
  title: { zh: 'Floyd 环检测', en: 'Floyd' },
  summary: {
    zh: 'Floyd 环检测属于list类别。',
    en: 'Floyd is a list algorithm.',
  },
  description: {
    zh: 'Floyd 环检测（Floyd）属于list类别的算法。',
    en: 'Floyd is an algorithm in the list category.',
  },
  tags: ["list","shortest-path","linked-list"],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
