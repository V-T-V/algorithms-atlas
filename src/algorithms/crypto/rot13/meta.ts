// ROT13 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'rot13',
  categoryId: 'crypto',
  title: { zh: 'ROT13 替换密码', en: 'ROT13 Substitution Cipher' },
  summary: {
    zh: '凯撒密码 shift=13 的特例，自对合（加密=解密）。',
    en: 'Caesar with shift=13; involutive (encryption equals decryption).',
  },
  description: {
    zh: 'ROT13 把字母表（26 个）平移 13 位：A→N、N→A。由于 26/2 = 13，应用两次即还原，故加密与解密是同一操作。非字母字符原样保留。它在 Usenet 时代用于隐藏剧透/谜底。',
    en: 'ROT13 shifts the 26-letter alphabet by 13: A→N, N→A. Because 26/2 = 13, applying it twice restores the text, so encryption and decryption are the same operation. Non-letters are preserved. It was popular on Usenet to hide spoilers or punchlines.',
  },
  tags: ['crypto', 'substitution', 'classical'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
