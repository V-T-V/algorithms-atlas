// 部分键哈希（Partial Key Hash）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'hash-partial-key',
  categoryId: 'hashing',
  title: { zh: '部分键哈希', en: 'Partial Key Hash' },
  summary: {
    zh: '只哈希键的部分位段，加速分布不均键的快速分片。',
    en: 'Hash only selected bit-fields of a key; speeds sharding for skewed keys.',
  },
  description: {
    zh: '部分键哈希：从键中抽取若干位段（如高 8 位+低 8 位）组合后哈希，减少计算量。',
    en: 'Partial key hash: extract bit-fields (e.g. top 8 + low 8 bits) and combine; reduces computation.',
  },
  tags: ['hashing', 'sharding', 'optimization'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
