// 布谷鸟哈希 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'rand-cuckoo-hash',
  categoryId: 'randomized',
  title: { zh: '布谷鸟哈希', en: 'Cuckoo Hashing' },
  summary: { zh: '两个哈希函数的布谷鸟哈希表。', en: 'Cuckoo hash table with two hash functions.' },
  description: { zh: '查找 O(1) 最坏情况。', en: 'O(1) worst-case lookup.' },
  tags: ['randomized', 'hashing'],
  complexity: { time: 'O(1)', space: 'O(n)' },
};
