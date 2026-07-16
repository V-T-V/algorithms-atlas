// 约瑟夫变体（Josephus Variant）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'misc-josephus-variant',
  categoryId: 'misc',
  title: { zh: '约瑟夫变体', en: 'Josephus Variant' },
  summary: {
    zh: '每轮淘汰第 k 人，求幸存者位置，递推 O(n)。',
    en: 'Eliminate every k-th person; find survivor via O(n) recurrence.',
  },
  description: {
    zh: '约瑟夫问题：n 人围圈，每数到 k 淘汰。J(n,k)=(J(n-1,k)+k) mod n，J(1,k)=0。',
    en: 'Josephus: n in circle, eliminate every k-th. J(n,k)=(J(n-1,k)+k) mod n, J(1,k)=0.',
  },
  tags: ['misc', 'simulation', 'recurrence'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
