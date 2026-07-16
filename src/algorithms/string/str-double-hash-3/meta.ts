import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'str-double-hash-3',
  categoryId: 'string',
  title: { zh: '双哈希（避免碰撞）', en: 'Double Hash (Collision-Free)' },
  summary: {
    zh: '用两个不同模数同时哈希，碰撞概率趋近于零。',
    en: 'Two independent mod-pair hashes make collisions negligibly rare.',
  },
  description: {
    zh: '返回 (h1, h2) 二元组作为指纹，可用于哈希表去重或子串相等判定。',
    en: 'Returns (h1, h2) tuples as fingerprints; usable for hashing or substring equality.',
  },
  tags: ['string', 'hash', 'double-hash'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
