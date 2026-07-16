// 可变长度整数编码 (varint) · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'varint',
  categoryId: 'compression',
  title: { zh: '可变长度整数编码 (varint)', en: 'Variable-length Integer Encoding (varint)' },
  summary: {
    zh: '小数少字节、大数多字节（LEB128 / protobuf 风格）。',
    en: 'Fewer bytes for small numbers, more for large (LEB128 / protobuf style).',
  },
  description: {
    zh: 'varint（LEB128）把每个整数的 7 个有效位放进一字节，最高位作「继续位」：1 表示后面还有字节，0 表示结束。字节序为小端。它是 protobuf、MIDI 文件长度字段、DWARF 调试信息等的标准整数编码。',
    en: 'varint (LEB128) packs 7 payload bits per byte, using the high bit as a continuation flag (1 = more bytes follow, 0 = end). Byte order is little-endian. It is the standard integer encoding in protobuf, MIDI file lengths, DWARF debug info, etc.',
  },
  tags: ['compression', 'encoding', 'integer'],
  complexity: { time: 'O(log n)', space: 'O(log n)' },
};
