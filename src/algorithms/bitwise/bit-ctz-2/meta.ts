// 末尾零计数变种 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'bit-ctz-2',
  categoryId: 'bitwise',
  title: { zh: '末尾零计数（查表变种）', en: 'Count Trailing Zeros (Table Variant)' },
  summary: {
    zh: '逐字节查表实现的 ctz，返回最低位 1 的下标。',
    en: 'Byte-wise table-based ctz returning the index of the lowest set bit.',
  },
  description: {
    zh: '末尾零计数（ctz / Count Trailing Zeros）返回整数二进制中最低位 1 的下标（从 0 起）。\n\n本变种用 256 项查表：对 x 的每个字节，若低字节非 0 则直接查表；否则清零该字节并累加 8，直到找到非零字节。若 x == 0 则返回 -1（无定义）。\n\n复杂度 O(1)（对固定位宽）。',
    en: 'Count Trailing Zeros (ctz) returns the index of the lowest set bit. This byte-wise lookup variant scans bytes from low to high, accumulating 8 per all-zero byte. Returns -1 when x == 0. O(1) for fixed width.',
  },
  tags: ['bitwise', 'ctz', 'lookup-table'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
