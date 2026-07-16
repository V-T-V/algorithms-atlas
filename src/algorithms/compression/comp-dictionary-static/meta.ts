// 静态字典压缩 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'comp-dictionary-static',
  categoryId: 'compression',
  title: { zh: '静态字典压缩', en: 'Static Dictionary Compression' },
  summary: {
    zh: '用预设的「符号→短码」字典替换常见子串，双方共享同一张表。',
    en: 'Replace common substrings with short codes from a preset dictionary shared by both sides.',
  },
  description: {
    zh: '静态字典压缩：\n\n- 预先用一张固定的（符号, 编码）映射表，覆盖高频词或字节模式。\n- 编码：扫描输入，贪心匹配最长字典项并输出短码。\n- 解码：用同一张表反查。\n- 优点：无需传输字典；缺点：对域外数据无效。',
    en: 'Static dictionary compression:\n\n- A fixed (symbol, code) table covers high-frequency words or byte patterns.\n- Encode: scan input, greedily match the longest dictionary entry, emit its short code.\n- Decode: reverse-lookup the same table.\n- Pro: no dictionary transport; Con: useless off-domain.',
  },
  tags: ['compression', 'dictionary', 'lossless'],
  complexity: { time: 'O(n·L)', space: 'O(D)' },
};
