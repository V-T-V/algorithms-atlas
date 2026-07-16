// 希尔密码 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'crypto-hill-cipher',
  categoryId: 'crypto',
  title: { zh: '希尔密码', en: 'Hill Cipher' },
  summary: {
    zh: '用 n×n 矩阵在 mod 26 上对明文分块做线性变换，是多表替换的矩阵推广。',
    en: 'Encrypts plaintext blocks by an n×n matrix multiplication mod 26 — the matrix generalization of polyalphabetic ciphers.',
  },
  description: {
    zh: '2×2 实现：每对明文字母视作列向量，左乘密钥矩阵后模 26 得密文对。解密用矩阵模逆。',
    en: '2×2 implementation: treat each plaintext letter pair as a column vector, multiply by the key matrix mod 26. Decryption uses the modular matrix inverse.',
  },
  tags: ['crypto', 'matrix', 'linear-algebra'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
