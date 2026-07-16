// Whirlpool（Whirlpool）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'crypto-whirlpool',
  categoryId: 'crypto',
  title: { zh: 'Whirlpool', en: 'Whirlpool' },
  summary: {
    zh: 'Whirlpool：NESSIE 推荐的 512 位海绵/分组哈希。',
    en: 'Whirlpool: NESSIE-recommended 512-bit sponge/block hash.',
  },
  description: {
    zh: 'Whirlpool（Barreto & Rijmen 2000）基于 8×8 字节状态 + 类 AES S 盒 + MixRows/ShiftColumns 的 10 轮变换，输出 512 位。',
    en: 'Whirlpool (Barreto & Rijmen 2000) uses an 8×8 byte state with AES-like S-box and MixRows/ShiftColumns in a 10-round transform; outputs 512 bits.',
  },
  tags: ['crypto', 'whirlpool', 'hash', 'nessie', '512-bit'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
