// Gas Station · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'gas-station-g',
  categoryId: 'greedy',
  title: { zh: '加油站', en: 'Gas Station' },
  summary: {
    zh: '加油站属于greedy类别。',
    en: 'Gas Station is a greedy algorithm.',
  },
  description: {
    zh: '加油站（Gas Station）属于greedy类别的算法。',
    en: 'Gas Station is an algorithm in the greedy category.',
  },
  tags: ["greedy"],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
