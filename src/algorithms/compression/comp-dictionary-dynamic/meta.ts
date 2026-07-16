// 动态字典压缩 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'comp-dictionary-dynamic',
  categoryId: 'compression',
  title: { zh: '动态字典压缩', en: 'Dynamic Dictionary Compression' },
  summary: {
    zh: '类似 LZW：边压缩边学习新子串加入字典，单遍自适应无需预传字典。',
    en: 'LZW-like: learn new substrings into the dictionary on the fly, single-pass and self-adapting with no preset dictionary.',
  },
  description: {
    zh: '动态字典压缩（LZW 风格）：\n\n- 初始字典含所有单字节符号。\n- 读入最长已存在前缀 w，输出 w 的码；若 w+下一字符 是新串则加入字典。\n- 重复，字典随数据增长，对重复模式自适应。\n- 解码端同样动态重建字典，无需额外信息。',
    en: 'Dynamic dictionary compression (LZW-style):\n\n- Initial dictionary holds all single-byte symbols.\n- Read the longest existing prefix w, emit its code; if w+next char is new, add it to the dictionary.\n- Repeat; the dictionary grows with the data, self-adapting to repetition.\n- Decoder rebuilds the dictionary identically, no side channel needed.',
  },
  tags: ['compression', 'dictionary', 'lossless', 'adaptive'],
  complexity: { time: 'O(n)', space: 'O(D)' },
};
