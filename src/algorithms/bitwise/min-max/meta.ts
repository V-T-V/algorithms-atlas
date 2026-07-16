// Bitwise Min/Max · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'min-max',
  categoryId: 'bitwise',
  title: { zh: '位运算 min/max', en: 'Bitwise Min/Max' },
  summary: {
    zh: '位运算 min/max属于bitwise类别。',
    en: 'Bitwise Min/Max is a bitwise algorithm.',
  },
  description: {
    zh: '位运算 min/max（Bitwise Min/Max）属于bitwise类别的算法。',
    en: 'Bitwise Min/Max is an algorithm in the bitwise category.',
  },
  tags: ["bitwise"],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
