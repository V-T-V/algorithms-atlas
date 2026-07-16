// Polybius 方阵密码 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'polybius-square',
  categoryId: 'crypto',
  title: { zh: 'Polybius 方阵密码', en: 'Polybius Square Cipher' },
  summary: {
    zh: '5×5 方阵把字母映射成两位数字（I/J 合并）。',
    en: 'A 5×5 grid maps each letter to a two-digit number (I/J merged).',
  },
  description: {
    zh: 'Polybius 方阵把 26 个英文字母放进 5×5 网格（通常把 I 与 J 合并占一格），每个字母用其「行+列」(1..5) 表示成两位数字。加密就是把字母逐个替换成数字对。解密反向查表。',
    en: 'The Polybius square places the 26 English letters into a 5×5 grid (usually merging I and J into one cell), encoding each letter by its (row, column) (each 1..5) as a two-digit number. Encryption replaces each letter with such a pair; decryption reverses the lookup.',
  },
  tags: ['crypto', 'substitution', 'classical'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
