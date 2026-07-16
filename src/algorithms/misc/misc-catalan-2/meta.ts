// 卡特兰数枚举（Catalan Enumeration）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'misc-catalan-2',
  categoryId: 'misc',
  title: { zh: '卡特兰数枚举', en: 'Catalan Enumeration' },
  summary: {
    zh: '枚举合法括号/Dyck 路等结构，第 n 个卡特兰数 C_n=binom(2n,n)/(n+1)。',
    en: 'Count valid-paren / Dyck-path structures; the n-th Catalan C_n=binom(2n,n)/(n+1).',
  },
  description: {
    zh: '卡特兰数 C_n=(2n)!/((n+1)!n!)。计数括号匹配、二叉树、多边形三角剖分等。',
    en: 'Catalan C_n=(2n)!/((n+1)!n!). Counts paren matchings, binary trees, polygon triangulations.',
  },
  tags: ['misc', 'combinatorics'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
