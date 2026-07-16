// AES-CTR（AES-CTR）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'crypto-aes-ctr',
  categoryId: 'crypto',
  title: { zh: 'AES-CTR', en: 'AES-CTR' },
  summary: {
    zh: 'AES-CTR：计数器模式，加密 nonce++ 后与明文异或。',
    en: 'AES-CTR: counter mode, encrypt nonce++ then XOR with plaintext.',
  },
  description: {
    zh: 'AES-CTR 把计数器 nonce||counter 作为 AES 输入，生成密钥流与明文异或。流式可并行，加解密相同操作。',
    en: 'AES-CTR feeds nonce||counter into AES to produce a keystream XORed with plaintext; streamable, parallelizable, encrypt = decrypt.',
  },
  tags: ['crypto', 'aes', 'ctr', 'stream'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
