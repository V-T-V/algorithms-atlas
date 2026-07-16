// Snappy · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'comp-snappy',
  categoryId: 'compression',
  title: { zh: 'Snappy 压缩', en: 'Snappy Compression' },
  summary: {
    zh: 'Google 高速压缩格式：变长整数 + 简单回引，侧重速度而非压缩率。',
    en: 'Google high-speed format using varints and simple back-references, favoring speed over ratio.',
  },
  description: {
    zh: 'Snappy 的设计目标是「极快压缩/解压」而非最小体积：\n\n- tag 字节低 2 位定义类型：00 字面量，01/10/11 回引(1~4 字节)。\n- 字面量长度用变长编码；回引用更短的 tag 表达近距离匹配。\n- 不追求最佳压缩率，但在 Google 内部广泛使用。',
    en: 'Snappy targets extreme speed, not minimum size:\n\n- Low 2 bits of the tag byte give the type: 00 literal, 01/10/11 back-references (1..4 bytes).\n- Literal length uses a varint; shorter tags express closer matches.\n- Not optimal ratio but widely used inside Google.',
  },
  tags: ['compression', 'dictionary', 'lossless', 'fast'],
  complexity: { time: 'O(n·W)', space: 'O(n)' },
};
