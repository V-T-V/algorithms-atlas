// LZ78 字典压缩 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'lz78',
  categoryId: 'compression',
  title: { zh: 'LZ78 字典压缩', en: 'LZ78 Dictionary Compression' },
  summary: {
    zh: '逐步构建字典，输出 (索引, 字符) 二元组。',
    en: 'Builds a dictionary incrementally, emits (index, char) pairs.',
  },
  description: {
    zh: 'LZ78（Lempel-Ziv 1978）边扫描边建立字典：每步在当前输入中找到字典中最长前缀，输出其索引与紧随其后的一个新字符，并把「前缀+字符」作为新条目加入字典。第 0 号条目约定为空串。',
    en: 'LZ78 (Lempel-Ziv 1978) builds a dictionary on the fly: at each step it finds the longest prefix of the remaining input present in the dictionary, emits its index plus the next new character, and inserts (prefix+char) as a new entry. Entry 0 is the empty string.',
  },
  tags: ['compression', 'dictionary', 'lossless'],
  complexity: { time: 'O(n²)', space: 'O(n)' },
};
