// DES / 3DES（DES / Triple DES）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'crypto-des-3des',
  categoryId: 'crypto',
  title: { zh: 'DES / 3DES', en: 'DES / Triple DES' },
  summary: {
    zh: 'DES 16 轮 Feistel；3DES 三次 DES 提升安全。',
    en: 'DES 16-round Feistel; 3DES applies DES three times for security.',
  },
  description: {
    zh: 'DES（IBM/NIST 1977）64 位分组 56 位密钥 16 轮 Feistel。3DES = E(K1)→D(K2)→E(K1) 提升有效密钥长度。',
    en: 'DES (IBM/NIST 1977): 64-bit block, 56-bit key, 16-round Feistel. 3DES = E(K1)→D(K2)→E(K1) raises the effective key length.',
  },
  tags: ['crypto', 'des', '3des', 'feistel', 'block'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
