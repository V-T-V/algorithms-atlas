// 全域哈希 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'rand-hashing-universal',
  categoryId: 'randomized',
  title: { zh: '全域哈希', en: 'Universal Hashing' },
  summary: {
    zh: '从全域哈希族随机选哈希函数。',
    en: 'Pick a hash function from a universal family at random.',
  },
  description: {
    zh: 'h_{a,b}(x)=((a·x+b) mod p) mod m。',
    en: 'h_{a,b}(x)=((a·x+b) mod p) mod m.',
  },
  tags: ['randomized', 'hashing'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
