// LZ4 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'comp-lz4',
  categoryId: 'compression',
  title: { zh: 'LZ4 快速压缩', en: 'LZ4 Fast Compression' },
  summary: {
    zh: 'LZ4 以解压速度优先：字面量长度 + (token, 匹配) 的紧凑编码。',
    en: 'LZ4 prioritizes decompression speed with literal-length + (token, match) encoding.',
  },
  description: {
    zh: 'LZ4 是 LZ77 家族中专注于「极致解压速度」的代表：\n\n- 每个 token 由 1 字节首部组成，高 4 位 = 匹配长度，低 4 位 = 字面量长度(0..15)。\n- 字面量长度若为 15，则继续读扩展字节(0xff 表示继续)。\n- 之后是字面量原始字节，再是 16 位小端匹配距离，最后是扩展匹配长度。\n- 本实现为简化演示版，省略部分边界细节但保留核心结构。',
    en: 'LZ4 is the LZ77-family format built for extreme decompression speed:\n\n- Each token starts with a 1-byte header: high 4 bits = match length, low 4 bits = literal length (0..15).\n- Literal length 15 continues with extension bytes (0xff means continue).\n- Then raw literal bytes, a 16-bit little-endian match distance, and an extended match length.\n- This is a simplified demo preserving the core structure.',
  },
  tags: ['compression', 'dictionary', 'lossless', 'fast'],
  complexity: { time: 'O(n·W)', space: 'O(n)' },
};
