// Salsa20 流密码 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'crypto-salsa20',
  categoryId: 'crypto',
  title: { zh: 'Salsa20 流密码', en: 'Salsa20 Stream Cipher' },
  summary: {
    zh: 'Daniel Bernstein 设计的 ARX 流密码，20 轮四分之一轮变换，输出 64 字节密钥流块。',
    en: 'An ARX stream cipher by Daniel Bernstein: 20 rounds of quarter-round transforms emit a 64-byte keystream block.',
  },
  description: {
    zh: '状态为 16 个 32 位字，含常数 σ/τ、密钥、nonce 与计数器。每轮做 a⊕=rot(b,7)+c 的 ARX 更新。',
    en: 'State is 16 32-bit words with σ/τ constants, key, nonce, counter. Each round applies ARX updates a⊕=rot(b,7)+c.',
  },
  tags: ['crypto', 'stream', 'arx', 'symmetric'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
