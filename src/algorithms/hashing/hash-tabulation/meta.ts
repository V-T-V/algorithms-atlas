// hash-tabulation · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'hash-tabulation',
  categoryId: 'hashing',
  title: { zh: 'Tabulation Hashing', en: 'Tabulation Hashing' },
  summary: {
    zh: '表格哈希：用三维随机表把字符串映射为 64 位，3-独立、O(1) 查表。',
    en: 'Tabulation hashing: 3-dimensional random table maps strings to 64 bits, 3-independent, O(1) lookup.',
  },
  description: {
    zh: '表格哈希（Zobrist / Siegel）：\n\n- 为每个字节位置 c 和每个值 v 预生成随机 64 位 T[c][v]。\n- 字符串哈希 = 对每字节 XOR T[i][b[i]]。\n- 是 3-独立哈希族，但不 4-独立。\n- 用于简单高效的哈希表分桶。',
    en: 'Tabulation hashing (Zobrist / Siegel):\n\n- Pre-generate random 64-bit T[c][v] for each byte position c and value v.\n- String hash = XOR T[i][b[i]] for each byte.\n- Forms a 3-independent hashing family but not 4-independent.\n- Used for simple and efficient hash table bucketing.',
  },
  tags: ['hashing', 'tabulation', 'zobrist', 'universal'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
