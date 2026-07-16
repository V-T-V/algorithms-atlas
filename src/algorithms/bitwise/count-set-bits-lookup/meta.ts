// 查表法数 1 (Lookup Popcount) · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'count-set-bits-lookup',
  categoryId: 'bitwise',
  title: { zh: '查表法数 1 (Lookup Popcount)', en: 'Lookup-table Popcount' },
  summary: {
    zh: '预计算每字节 1 的个数，按字节累加。',
    en: 'Precompute per-byte bit counts, then accumulate byte by byte.',
  },
  description: {
    zh: '查表法统计非负整数二进制中 1 的个数：先用 256 项表记录 0~255 每个值的 popcount，再把输入拆成若干字节查表累加。对 32 位整数只需 4 次查表 + 4 次加法，常数级复杂度，比逐位扫描更快。',
    en: 'The lookup-table method counts the 1-bits of a non-negative integer: precompute a 256-entry table of popcounts for 0..255, then split the input into bytes and sum the table lookups. For a 32-bit integer this is just 4 lookups + 4 adds — constant time and faster than bit-by-bit scanning.',
  },
  tags: ['bitwise', 'popcount', 'lookup-table'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
