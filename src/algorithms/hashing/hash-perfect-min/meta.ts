// 完美哈希构造（Perfect Hash Construction）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'hash-perfect-min',
  categoryId: 'hashing',
  title: { zh: '完美哈希构造', en: 'Perfect Hash Construction' },
  summary: {
    zh: '对静态键集构造无冲突哈希，查询 O(1) 且无假阳性。',
    en: 'Construct a collision-free hash for a static key set; O(1) lookup, no false positives.',
  },
  description: {
    zh: '完美哈希（CHD 简化）：先用一个哈希把键分桶，每桶内再找使无冲突的二级哈希。总表大小接近键数。',
    en: 'Perfect hash (CHD simplified): primary hash buckets keys; per bucket find a collision-free secondary hash.',
  },
  tags: ['hashing', 'perfect-hash', 'static'],
  complexity: { time: 'O(n) build', space: 'O(n)' },
};
