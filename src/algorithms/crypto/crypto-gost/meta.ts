// GOST 28147（GOST 28147）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'crypto-gost',
  categoryId: 'crypto',
  title: { zh: 'GOST 28147', en: 'GOST 28147' },
  summary: {
    zh: 'GOST：俄罗斯标准 32 轮 Feistel，S 盒可由用户定义。',
    en: 'GOST: Russian standard 32-round Feistel with user-supplied S-boxes.',
  },
  description: {
    zh: 'GOST 28147-89（苏联/俄罗斯标准）64 位分组 256 位密钥 32 轮 Feistel，使用 8 个 4×4 S 盒（可选密钥相关 S 盒）。',
    en: 'GOST 28147-89 (Soviet/Russian standard) is a 64-bit-block 256-bit-key 32-round Feistel using eight 4×4 S-boxes (optionally key-dependent).',
  },
  tags: ['crypto', 'gost', 'feistel', 'russian'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
