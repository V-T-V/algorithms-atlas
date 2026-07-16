// CBC 模式（CBC Mode）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'crypto-cbc-mode',
  categoryId: 'crypto',
  title: { zh: 'CBC 模式', en: 'CBC Mode' },
  summary: { zh: '每块先与前密文异或。', en: 'XORs each block with previous ciphertext.' },
  description: {
    zh: 'CBC(Cipher Block Chaining)模式每块明文先与上一块密文异或再加密，IV 用于首块，隐藏模式更安全。',
    en: 'CBC XORs each plaintext block with the previous ciphertext before encryption; an IV seeds the first block.',
  },
  tags: ['crypto', 'cbc', 'mode-of-operation'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
