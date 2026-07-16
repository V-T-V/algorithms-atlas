// CAST-5（CAST-5）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'crypto-cast5',
  categoryId: 'crypto',
  title: { zh: 'CAST-5', en: 'CAST-5' },
  summary: {
    zh: 'CAST-5：12/16 轮 Feistel，3 种轮函数。',
    en: 'CAST-5: 12/16-round Feistel with three round-function types.',
  },
  description: {
    zh: 'CAST-5（Adams 1996）64 位分组 Feistel，根据轮次使用三种不同轮函数（含加/减/异或 + 旋转），密钥扩展用 S 盒。',
    en: 'CAST-5 (Adams 1996) is a 64-bit-block Feistel cipher using three distinct round functions per round (with add/sub/xor and rotation); key schedule uses S-boxes.',
  },
  tags: ['crypto', 'cast5', 'feistel', 'block'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
