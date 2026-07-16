// Rail Fence 栅栏密码 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'rail-fence',
  categoryId: 'crypto',
  title: { zh: '栅栏密码 (Rail Fence)', en: 'Rail Fence Cipher' },
  summary: {
    zh: '按 Z 字形把字符分到 n 条「栏」后逐栏读取。',
    en: 'Writes characters in a zigzag across n "rails", then reads rail by rail.',
  },
  description: {
    zh: '栅栏密码（rail fence）是经典换位密码：把明文按 Z 字形（上下往返）排到 rails 条「栏」里，再按栏从上到下拼接成密文。解密反向填充。它不改变字母本身，只重排顺序。',
    en: 'The rail fence cipher is a classical transposition cipher: plaintext is written in a zigzag across `rails` rows, then concatenated rail by rail to form ciphertext. Decryption reverses the filling. It does not change letters, only their order.',
  },
  tags: ['crypto', 'transposition', 'classical'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
