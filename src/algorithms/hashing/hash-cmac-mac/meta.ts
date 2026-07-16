// CMAC 消息认证（CMAC Message Authentication）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'hash-cmac-mac',
  categoryId: 'hashing',
  title: { zh: 'CMAC 消息认证', en: 'CMAC Message Authentication' },
  summary: {
    zh: '基于块密码的 MAC，用子密钥对最后块特殊处理，验证完整性。',
    en: 'Block-cipher-based MAC using subkeys for the final block; verifies integrity.',
  },
  description: {
    zh: 'CMAC：用 AES 等块密码 CBC 模式，最后块与 K1/K2 异或。输出作消息认证码。',
    en: 'CMAC: CBC mode over a block cipher; final block XORed with K1/K2. Output is the authentication tag.',
  },
  tags: ['hashing', 'mac', 'authentication'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
