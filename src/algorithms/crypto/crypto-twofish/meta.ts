// Twofish（Twofish）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'crypto-twofish',
  categoryId: 'crypto',
  title: { zh: 'Twofish', en: 'Twofish' },
  summary: {
    zh: 'Twofish：AES 候选，Feistel + 密钥相关 S 盒。',
    en: 'Twofish: AES finalist, Feistel with key-dependent S-boxes.',
  },
  description: {
    zh: 'Twofish（Schneier 等）128 位分组 AES 候选：16 轮 Feistel + 4 个密钥相关 S 盒 + Pseudo-Hadamard 变换。',
    en: 'Twofish (Schneier et al.) is a 128-bit-block AES finalist: 16-round Feistel + 4 key-dependent S-boxes + Pseudo-Hadamard transform.',
  },
  tags: ['crypto', 'twofish', 'aes-finalist', 'feistel'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
