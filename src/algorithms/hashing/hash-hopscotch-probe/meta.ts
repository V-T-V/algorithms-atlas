// Hopscotch 哈希（Hopscotch Hashing）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'hash-hopscotch-probe',
  categoryId: 'hashing',
  title: { zh: 'Hopscotch 哈希', en: 'Hopscotch Hashing' },
  summary: {
    zh: '开放寻址变体：键必须在家的 H 邻域内，利用位图维护邻近性。',
    en: 'Open-addressing variant: keys stay within H of home; a bitmap tracks neighborhood.',
  },
  description: {
    zh: 'Hopscotch：每个槽维护邻域位图。插入时若超出邻域，则把更近的元素"位移"过来腾位。',
    en: 'Hopscotch: each slot has a neighborhood bitmap. On insert beyond range, displace nearer elements to make room.',
  },
  tags: ['hashing', 'hash-table', 'hopscotch'],
  complexity: { time: 'O(1) amortized', space: 'O(n)' },
};
