// 计数布隆（Counting Bloom Filter）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'hash-counting-bloom',
  categoryId: 'hashing',
  title: { zh: '计数布隆', en: 'Counting Bloom Filter' },
  summary: {
    zh: '用计数器代替位支持删除，应对插入/删除流。',
    en: 'Uses counters instead of bits to support deletion under insert/delete streams.',
  },
  description: {
    zh: '计数布隆：每槽为计数器（通常 4 位）。插入+1，删除-1。避免位布隆无法删除的问题，但占更多空间。',
    en: 'Counting bloom: each slot a counter (usually 4 bits). Insert +1, delete -1. Allows deletion at extra space.',
  },
  tags: ['hashing', 'bloom-filter', 'counting'],
  complexity: { time: 'O(k)', space: 'O(m)' },
};
