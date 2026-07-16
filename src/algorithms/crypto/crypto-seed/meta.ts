// SEED（SEED）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'crypto-seed',
  categoryId: 'crypto',
  title: { zh: 'SEED', en: 'SEED' },
  summary: {
    zh: 'SEED：韩国 KISA 标准 16 轮 Feistel。',
    en: 'SEED: Korean KISA-standard 16-round Feistel.',
  },
  description: {
    zh: 'SEED（KISA 1998）128 位分组 16 轮 Feistel，使用两个 8×8 S 盒与加法/异或混合轮函数。',
    en: 'SEED (KISA 1998) is a 128-bit-block 16-round Feistel using two 8×8 S-boxes and an add/xor-mixed round function.',
  },
  tags: ['crypto', 'seed', 'feistel', 'kisa'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
