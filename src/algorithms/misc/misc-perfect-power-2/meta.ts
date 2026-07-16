// 完美幂判定（Perfect Power Detection）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'misc-perfect-power-2',
  categoryId: 'misc',
  title: { zh: '完美幂判定', en: 'Perfect Power Detection' },
  summary: {
    zh: '判断 n 是否可写成 a^b（a>0,b>1），枚举指数二分底数。',
    en: 'Test if n = a^b with a>0,b>1 by enumerating exponent and binary-searching base.',
  },
  description: {
    zh: '完美幂：n=a^b。枚举 b∈[2,log2 n]，对每个 b 二分找 a 使 a^b=n。存在则返回 (a,b)。',
    en: 'Perfect power: n=a^b. Try each b in [2,log2 n], binary-search base a with a^b=n.',
  },
  tags: ['misc', 'number-theory'],
  complexity: { time: 'O(log²n)', space: 'O(1)' },
};
