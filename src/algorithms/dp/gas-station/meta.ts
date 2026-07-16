// Gas Station · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'gas-station',
  categoryId: 'dp',
  title: { zh: '加油站', en: 'Gas Station' },
  summary: {
    zh: '加油站属于dp类别。',
    en: 'Gas Station is a dp algorithm.',
  },
  description: {
    zh: '加油站（Gas Station）属于dp类别的算法。',
    en: 'Gas Station is an algorithm in the dp category.',
  },
  tags: ["dp"],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
