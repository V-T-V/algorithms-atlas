// 字节序交换（Bswap）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'bit-bswap',
  categoryId: 'bitwise',
  title: { zh: '字节序交换', en: 'Byte Swap (BSWAP)' },
  summary: {
    zh: '反转 32 位整数的字节顺序（大端↔小端转换）。',
    en: 'Reverse the byte order of a 32-bit integer (big-endian ↔ little-endian).',
  },
  description: {
    zh: '字节序交换（BSWAP）：反转 32 位整数的 4 个字节顺序，等价于大端↔小端转换。\n\n```\n((x & 0xff) << 24) | ((x & 0xff00) << 8) | ((x >>> 8) & 0xff00) | ((x >>> 24) & 0xff)\n```\n\n常用于跨字节序平台的数据交换、网络字节序转换。复杂度 O(1)。',
    en: 'Byte swap (BSWAP): reverses the 4 bytes of a 32-bit integer, equivalent to big-endian ↔ little-endian conversion. Commonly used for cross-endian data exchange and network byte order. O(1).',
  },
  tags: ['bitwise', 'bswap', 'endian', 'byte-order'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
