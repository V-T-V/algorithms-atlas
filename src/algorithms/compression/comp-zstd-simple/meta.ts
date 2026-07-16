// Zstandard (简化) · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'comp-zstd-simple',
  categoryId: 'compression',
  title: { zh: 'Zstandard 简化', en: 'Zstandard (Simplified)' },
  summary: {
    zh: 'Zstd 用 LZ77 + FSE(有限状态熵) 后处理；本实现演示其前缀匹配核心。',
    en: 'Zstd combines LZ77 with FSE (finite-state entropy); this demo shows the prefix-matching core.',
  },
  description: {
    zh: 'Zstandard 是 Facebook 开发的现代压缩格式，平衡速度与压缩率：\n\n- 第一阶段：类 LZ77 的前缀匹配，输出字面量与回引序列。\n- 第二阶段：用 FSE/Huffman 对 token 做熵编码。\n- 本实现只演示第一阶段（前缀匹配），熵编码部分见其他算法。',
    en: 'Zstandard is a modern format by Facebook balancing speed and ratio:\n\n- Stage 1: LZ77-like prefix matching producing literals and back-references.\n- Stage 2: entropy coding of tokens via FSE/Huffman.\n- This implementation demonstrates stage 1 only.',
  },
  tags: ['compression', 'dictionary', 'lossless', 'modern'],
  complexity: { time: 'O(n·W)', space: 'O(n)' },
};
