// SHACAL（SHACAL）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'crypto-shacal',
  categoryId: 'crypto',
  title: { zh: 'SHACAL', en: 'SHACAL' },
  summary: {
    zh: 'SHACAL：把 SHA-1 当分组密码（密钥=消息）。',
    en: 'SHACAL: SHA-1 used as a block cipher (key = message).',
  },
  description: {
    zh: 'SHACAL-1（Handschuh & Naccache）把 SHA-1 的压缩函数当作分组密码：160 位状态作明文，512 位消息块作密钥，反向运行 SHA-1 round 函数解密。',
    en: 'SHACAL-1 (Handschuh & Naccache) treats the SHA-1 compression function as a block cipher: the 160-bit state is the plaintext, the 512-bit message block is the key, decryption runs the SHA-1 round function in reverse.',
  },
  tags: ['crypto', 'shacal', 'sha1', 'block', 'neessie'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
