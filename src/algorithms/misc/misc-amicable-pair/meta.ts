// 亲和数对（Amicable Pair）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'misc-amicable-pair',
  categoryId: 'misc',
  title: { zh: '亲和数对', en: 'Amicable Pair' },
  summary: {
    zh: '两数各自真因子和等于对方，如 (220,284)，枚举验证。',
    en: 'Two numbers whose proper-divisor sums equal each other, e.g. (220,284); enumerate to verify.',
  },
  description: {
    zh: '亲和数：σ(a)-a=b 且 σ(b)-b=a。枚举范围内数，计算因子和检查配对。',
    en: 'Amicable: σ(a)-a=b and σ(b)-b=a. Scan range, compute divisor-sum, check pairing.',
  },
  tags: ['misc', 'number-theory'],
  complexity: { time: 'O(n√n)', space: 'O(n)' },
};
