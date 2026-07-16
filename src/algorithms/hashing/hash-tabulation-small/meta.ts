// 表格哈希（Tabulation Hashing）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'hash-tabulation-small',
  categoryId: 'hashing',
  title: { zh: '表格哈希', en: 'Tabulation Hashing' },
  summary: {
    zh: '查表法：每字节查随机表后异或，3-独立但极快，适合简单哈希表。',
    en: 'Zobrist-style tabulation: XOR per-byte table lookups; 3-independent yet extremely fast.',
  },
  description: {
    zh: 'Tabulation hashing：对每字节位置维护随机表 T[c][pos]，h = XOR over pos of T[byte][pos]。理论 3-独立。',
    en: 'Tabulation hashing: per-position random table T[c][pos]; h = XOR of T[byte][pos]. Theoretically 3-independent.',
  },
  tags: ['hashing', 'non-cryptographic', 'tabulation'],
  complexity: { time: 'O(n)', space: 'O(256·L)' },
};
