// Beaufort 密码 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'beaufort-cipher',
  categoryId: 'crypto',
  title: { zh: 'Beaufort 密码', en: 'Beaufort Cipher' },
  summary: {
    zh: '多表替换：C = (K - P) mod 26，自反（加密=解密）。',
    en: 'Polyalphabetic: C = (K - P) mod 26; self-reciprocal (encrypt = decrypt).',
  },
  description: {
    zh: 'Beaufort 密码是维吉尼亚的近亲，但公式为 C_i = (K_i - P_i) mod 26（即用密钥字母减去明文字母）。它是「自反」的：对密文再施同密钥即还原明文。非字母保留，密钥字母循环使用。',
    en: 'The Beaufort cipher is a relative of Vigenère using C_i = (K_i - P_i) mod 26 (subtract plaintext from the key letter). It is self-reciprocal: applying the same key to ciphertext restores plaintext. Non-letters are preserved and the key cycles.',
  },
  tags: ['crypto', 'substitution', 'polyalphabetic', 'classical'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
