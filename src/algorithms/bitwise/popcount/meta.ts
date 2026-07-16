// Population Count · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'popcount',
  categoryId: 'bitwise',
  title: { zh: '位计数', en: 'Population Count' },
  summary: {
    zh: '位计数属于bitwise类别。',
    en: 'Population Count is a bitwise algorithm.',
  },
  description: {
    zh: '位计数（Population Count）属于bitwise类别的算法。',
    en: 'Population Count is an algorithm in the bitwise category.',
  },
  tags: ["bitwise","bit-manipulation","sorting"],
  complexity: { time: 'O(k)', space: 'O(1)' },
};
